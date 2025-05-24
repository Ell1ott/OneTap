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
import { KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { useEffect } from 'react';
import { InterFontBase64 } from './InterFontBase64';

export const RichTextEditor = () => {
  const customFont = `
${InterFontBase64}
* {
    font-family: 'Inter', sans-serif;
    // change the optical size
    font-variation-settings: 'opsz' 16;
}
`;

  // Get current date in pretty format
  const getCurrentDateContent = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const prettyDate = today.toLocaleDateString('en-US', options);
    return `<h1>${prettyDate}</h1><p></p>`;
  };

  const editor = useEditorBridge({
    customSource: editorHtml,
    bridgeExtensions: [...TenTapStartKit, CodeBridge.configureCSS(customFont)],
    autofocus: true,
    initialContent: getCurrentDateContent(),
  });

  // Monitor content changes and ensure h1 is always at the top
  const content = useEditorContent(editor, { type: 'html' });

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
