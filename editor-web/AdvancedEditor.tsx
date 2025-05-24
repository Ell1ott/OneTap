import React from 'react';
import { EditorContent } from '@tiptap/react';
import { useTenTap, TenTapStartKit } from '@10play/tentap-editor';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Placeholder from '@tiptap/extension-placeholder';
import { CustomStarterKit } from '../components/diary/CustomStarterKit';
/**
 * Here we control the web side of our custom editor
 */
export const AdvancedEditor = () => {
  const editor = useTenTap({
    bridges: [...CustomStarterKit],
    tiptapOptions: {
      extensions: [
        Document.extend({
          content: 'heading block*',
        }),
        Paragraph,
        Text,
        Placeholder.configure({
          showOnlyCurrent: false,
          placeholder: ({ node }) => {
            if (node.type.name === 'heading') {
              return 'What’s the title?';
            }

            return 'What has happened today?';
          },
        }),
      ],
    },
  });
  return (
    <EditorContent
      editor={editor}
      className={window.dynamicHeight ? 'dynamic-height' : undefined}
    />
  );
};
