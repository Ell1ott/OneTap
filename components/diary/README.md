# Diary Auto-Save Functionality

This diary component provides automatic saving functionality that ensures your content is never lost, even if the app is closed unexpectedly. **Now fully cross-platform - works on React Native AND web!**

## Features

### 🔄 Auto-Save

- **Debounced Saving**: Content is automatically saved 1 second after you stop typing
- **App Background Saving**: Immediately saves when the app goes to the background (React Native)
- **Component Unmount Saving**: Saves when the editor component is unmounted
- **Cross-Platform Storage**: Uses localStorage on web, AsyncStorage + FileSystem on React Native
- **Dual Storage**: Always maintains both primary and backup storage

### 📁 Storage Location

#### Web Platform:

- **Primary Storage**: `localStorage` with key `diary_content`
- **Backup Storage**: `localStorage` with key `diary_content_backup`
- **Export**: Downloads HTML file to user's default download folder

#### React Native Platform:

- **Primary Storage**: AsyncStorage with key `diary_content` for fast access
- **Backup Storage**: `{DocumentDirectory}/diary/diary_content.html` as reliable backup
- **Export**: Uses native sharing to export HTML file

### 🚀 Loading Behavior

- Loads previously saved content on app startup
- Shows loading state while content is being retrieved
- Falls back to current date header if no saved content exists
- **Platform Detection**: Automatically chooses the right storage method

### 🌐 Cross-Platform Compatibility

- **Web**: Works in any modern browser with localStorage support
- **iOS**: Full native functionality with file system backup
- **Android**: Full native functionality with file system backup
- **Expo Web**: Seamless experience using the same codebase

## Usage

### Basic Usage (Current Implementation)

The `RichTextEditor` component automatically handles all saving and loading on any platform:

```tsx
import { RichTextEditor } from './components/diary/RichTextEditor';

export default function DiaryScreen() {
  return <RichTextEditor />;
}
```

### Advanced Usage with Actions

For additional functionality like manual save, export, and clear:

```tsx
import { RichTextEditor } from './components/diary/RichTextEditor';
import { DiaryActions } from './components/diary/DiaryActions';
import { useEditorContent } from '@10play/tentap-editor';

export default function DiaryScreen() {
  const content = useEditorContent(editor, { type: 'html' });

  return (
    <View style={{ flex: 1 }}>
      <RichTextEditor />
      <DiaryActions
        currentContent={content}
        onContentCleared={() => {
          // Handle content cleared event
        }}
      />
    </View>
  );
}
```

### Using the Storage Hook

For custom components that need diary storage access:

```tsx
import { useDiaryStorage } from '../../utils/useDiaryStorage';

function MyCustomComponent() {
  const { saveContent, loadContent, clearContent, isLoading, error } = useDiaryStorage();

  const handleSave = async () => {
    const success = await saveContent('<p>My content</p>');
    if (success) {
      console.log('Saved successfully!');
    }
  };

  return (
    <button onPress={handleSave} disabled={isLoading}>
      Save Content
    </button>
  );
}
```

## API Reference

### DiaryStorage

Direct storage utility functions:

```typescript
import { DiaryStorage } from '../../utils/diaryStorage';

// Save content (works on all platforms)
await DiaryStorage.saveDiaryContent(htmlContent);

// Load content (returns current date content if none saved)
const content = await DiaryStorage.loadDiaryContent();

// Clear all saved content
await DiaryStorage.clearDiaryContent();

// Get file path (platform-specific)
const path = await DiaryStorage.getDiaryFilePath();

// Check if running on web
const isWeb = DiaryStorage.isWeb();
```

### useDiaryStorage Hook

React hook with loading states and error handling:

```typescript
const {
  saveContent, // (content: string) => Promise<boolean>
  loadContent, // () => Promise<string | null>
  clearContent, // () => Promise<boolean>
  getFilePath, // () => Promise<string | null>
  isLoading, // boolean
  error, // string | null
  clearError, // () => void
} = useDiaryStorage();
```

## Platform-Specific Behavior

### Web Platform

- **Storage**: Uses browser's localStorage for both primary and backup
- **Export**: Downloads HTML file via browser download
- **Persistence**: Data persists across browser sessions
- **File Path**: Returns `localStorage://diary_content_backup`

### React Native Platform

- **Storage**: AsyncStorage for speed + FileSystem for reliability
- **Export**: Native sharing dialog with HTML file
- **Persistence**: Data survives app updates and reinstalls
- **File Path**: Returns actual file system path

## File Structure

```
components/diary/
├── RichTextEditor.tsx        # Main editor with auto-save (cross-platform)
├── DiaryActions.tsx          # Optional action buttons (cross-platform)
├── InterFontBase64.ts        # Font configuration
└── README.md                 # This documentation

utils/
├── diaryStorage.ts           # Cross-platform storage functionality
└── useDiaryStorage.ts        # React hook wrapper
```

## Error Handling

The system is designed to be resilient across platforms:

1. **Storage Failures**: Falls back between primary and backup storage
2. **Load Failures**: Returns current date content as fallback
3. **Platform Detection**: Automatically uses appropriate storage APIs
4. **Web Compatibility**: Graceful degradation when native APIs unavailable
5. **Network Issues**: All storage is local, no network dependency
6. **App Crashes**: Content is saved before app backgrounds (React Native)

## Performance

- **Platform Optimized**: Uses the best storage method for each platform
- **Debounced Saving**: Prevents excessive writes during typing
- **Fast Loading**: Memory-based storage for quick access
- **Reliable Backup**: Persistent storage for data safety
- **Lazy Loading**: Editor only renders after content is loaded

## Privacy & Security

- All data is stored locally on the device/browser
- No cloud synchronization (you can add this separately if needed)
- Content is stored as HTML files for easy export/backup
- No encryption (add if needed for sensitive content)
- **Web**: Data stored in browser's localStorage
- **Mobile**: Data stored in app's private storage area

## Browser Compatibility

### Web Requirements

- Modern browser with localStorage support
- ES6+ JavaScript support
- File download capability for export feature

### Tested Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Migration Notes

If you're upgrading from the previous React Native-only version:

- No code changes needed in your components
- Existing React Native data will be automatically detected and migrated
- Web users will start with a fresh diary (no data loss on mobile)
