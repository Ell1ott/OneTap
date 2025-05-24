import {
  CoreBridge,
  RichText,
  TenTapStartKit,
  Toolbar,
  useEditorBridge,
} from '@10play/tentap-editor';
import { KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { InterFontBase64 } from './InterFontBase64';

export const RichTextEditor = () => {
  const customFont = `
${InterFontBase64}
* {
    font-family: 'Inter', sans-serif;
    // change the optical size
    font-variation-settings: 'opsz' 48;
}
    
.tiptap  {
  padding: 64px 24px;
}
`;

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: 'Start editing!',
    bridgeExtensions: [...TenTapStartKit, CoreBridge.configureCSS(customFont)],
  });

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
