import {
  CodeBridge,
  CoreBridge,
  PlaceholderBridge,
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

export const RichTextEditor = () => {
  const [initialContent, setInitialContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const customFont = `
${InterFontBase64}
* {
    font-family: 'Inter', sans-serif;
    // change the optical size
    font-variation-settings: 'opsz' 16;
}
`;

  // Load saved content on component mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        const savedContent = await DiaryStorage.loadDiaryContent();
        setInitialContent(savedContent);
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
  }, []);

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

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced saving (save after 1 second of no changes)
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await DiaryStorage.saveDiaryContent(content);
        console.log('Content auto-saved');
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
  }, [content, isLoading, initialContent]);

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
          await DiaryStorage.saveDiaryContent(content);
          console.log('Content saved on app background');
        } catch (error) {
          console.error('Failed to save on app background:', error);
        }
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription?.remove();
  }, [content, isLoading]);

  // Save immediately when component unmounts
  useEffect(() => {
    return () => {
      // Save immediately on unmount
      if (content && content.trim() !== '' && !isLoading) {
        DiaryStorage.saveDiaryContent(content).catch((error) => {
          console.error('Failed to save on unmount:', error);
        });
      }
    };
  }, [content, isLoading]);

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
