import {
  CodeBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useEditorBridge,
  useEditorContent,
} from '@10play/tentap-editor';
import { editorHtml } from '../../editor-web/build/editorHtml';
import { AppState, KeyboardAvoidingView, SafeAreaView, AppStateStatus } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { InterFontBase64 } from './InterFontBase64';
import { DiaryStorage } from '../../utils/diaryStorage';
import { useDiaryEntries } from '../../utils/useDiaryEntries';

interface RichTextEditorProps {
  entryId?: string; // If provided, edit specific entry. If not, use today's entry
  onContentChange?: (content: string) => void;
  multiEntryMode?: boolean; // If true, uses multi-entry system
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  entryId,
  onContentChange,
  multiEntryMode = true,
}) => {
  const [initialContent, setInitialContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(entryId || null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef(AppState.currentState);

  // Use multi-entry hook if in multi-entry mode
  const multiEntryHook = useDiaryEntries();

  const customFont = `
${InterFontBase64}
* {
    font-family: 'Inter', sans-serif;
    // change the optical size
    font-variation-settings: 'opsz' 16;
}
`;

  // Load content based on mode
  useEffect(() => {
    const loadContent = async () => {
      try {
        if (multiEntryMode) {
          // Multi-entry mode: load specific entry or today's entry
          if (entryId) {
            const entry = await DiaryStorage.loadEntry(entryId);
            if (entry) {
              setInitialContent(entry.content);
              setCurrentEntryId(entry.id);
            } else {
              throw new Error('Entry not found');
            }
          } else {
            // Get or create today's entry
            const todaysEntry = await DiaryStorage.getTodaysEntry();
            setInitialContent(todaysEntry.content);
            setCurrentEntryId(todaysEntry.id);
          }
        } else {
          // Legacy single-entry mode
          const savedContent = await DiaryStorage.loadDiaryContent();
          setInitialContent(savedContent);
        }
      } catch (error) {
        console.error('Failed to load diary content:', error);
        // Fallback to current date content
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        const prettyDate = today.toLocaleDateString('en-US', options);
        setInitialContent(`<h1>${prettyDate}</h1><p></p>`);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [entryId, multiEntryMode]);

  const editor = useEditorBridge({
    customSource: editorHtml,
    bridgeExtensions: [...TenTapStartKit, CodeBridge.configureCSS(customFont)],
    autofocus: true,
    initialContent: initialContent,
  });

  // Monitor content changes and auto-save with debouncing
  const content = useEditorContent(editor, { type: 'html' });

  useEffect(() => {
    // Don't save if we're still loading or if content is empty/initial
    if (isLoading || !content || content.trim() === '' || content === initialContent) {
      return;
    }

    // Notify parent of content change
    if (onContentChange) {
      onContentChange(content);
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced saving (save after 1 second of no changes)
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        if (multiEntryMode && currentEntryId) {
          // Multi-entry mode: update specific entry
          await DiaryStorage.updateEntryContent(currentEntryId, content);
          console.log('Multi-entry content auto-saved');
        } else {
          // Legacy mode: save to single diary
          await DiaryStorage.saveDiaryContent(content);
          console.log('Content auto-saved');
        }
      } catch (error) {
        console.error('Failed to auto-save content:', error);
      }
    }, 1000);

    // Cleanup timeout on component unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, isLoading, initialContent, multiEntryMode, currentEntryId, onContentChange]);

  // Listen for app state changes and save immediately when app goes to background
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/active|foreground/) &&
        nextAppState === 'background' &&
        content &&
        content.trim() !== '' &&
        !isLoading
      ) {
        // App is going to background, save immediately
        try {
          if (multiEntryMode && currentEntryId) {
            await DiaryStorage.updateEntryContent(currentEntryId, content);
            console.log('Multi-entry content saved on app background');
          } else {
            await DiaryStorage.saveDiaryContent(content);
            console.log('Content saved on app background');
          }
        } catch (error) {
          console.error('Failed to save on app background:', error);
        }
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription?.remove();
  }, [content, isLoading, multiEntryMode, currentEntryId]);

  // Save immediately when component unmounts
  useEffect(() => {
    return () => {
      // Save immediately on unmount
      if (content && content.trim() !== '' && !isLoading) {
        if (multiEntryMode && currentEntryId) {
          DiaryStorage.updateEntryContent(currentEntryId, content).catch((error) => {
            console.error('Failed to save on unmount:', error);
          });
        } else {
          DiaryStorage.saveDiaryContent(content).catch((error) => {
            console.error('Failed to save on unmount:', error);
          });
        }
      }
    };
  }, [content, isLoading, multiEntryMode, currentEntryId]);

  // Method to switch to a different entry (for multi-entry mode)
  const switchToEntry = async (entryId: string) => {
    if (!multiEntryMode) return;

    setIsLoading(true);
    try {
      const entry = await DiaryStorage.loadEntry(entryId);
      if (entry) {
        // Save current content before switching
        if (content && content.trim() !== '' && currentEntryId) {
          await DiaryStorage.updateEntryContent(currentEntryId, content);
        }

        setCurrentEntryId(entry.id);
        setInitialContent(entry.content);

        // Reset the editor with new content
        // Note: You might need to implement editor.setContent() method
        // or recreate the editor with new initial content
      }
    } catch (error) {
      console.error('Failed to switch entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the editor until we've loaded the initial content
  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        {/* You can add a loading spinner here if desired */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, height: '100%' }}>
      <RichText editor={editor} />
      <KeyboardAvoidingView
        behavior={'height'}
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
        }}>
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
