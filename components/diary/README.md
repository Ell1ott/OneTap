# Multi-File Diary System

This enhanced diary system provides **multiple file support** with automatic saving functionality that ensures your content is never lost. **Fully cross-platform - works on React Native AND web!**

## 🎯 **New Features**

### 📚 **Multi-Entry Support**

- **Multiple Diary Entries**: Create separate entries by date or topic
- **Smart Entry Management**: Automatic today's entry creation
- **Entry Browsing**: Search and filter through all your entries
- **Individual File Storage**: Each entry stored as a separate file/record

### 🔄 **Auto-Save (Enhanced)**

- **Per-Entry Auto-Save**: Each entry saves independently
- **Debounced Saving**: Content is automatically saved 1 second after you stop typing
- **App Background Saving**: Immediately saves when the app goes to the background (React Native)
- **Component Unmount Saving**: Saves when the editor component is unmounted
- **Cross-Platform Storage**: Uses localStorage on web, AsyncStorage + FileSystem on React Native

### 📁 **Storage Structure**

#### Web Platform:

- **Entry Index**: `localStorage['diary_entries_index']` - List of all entries
- **Individual Entries**: `localStorage['file_diary_entry_{id}.json']` - Each entry as JSON
- **Current Entry**: `localStorage['diary_current_entry_id']` - Active entry ID
- **Export**: Downloads JSON or HTML files to user's default download folder

#### React Native Platform:

- **Entry Index**: AsyncStorage with key `diary_entries_index`
- **Individual Entries**: `{DocumentDirectory}/diary/diary_entry_{id}.json`
- **Current Entry**: AsyncStorage with key `diary_current_entry_id`
- **Export**: Uses native sharing to export JSON or HTML files

## Usage

### 🚀 **Quick Start - Complete Diary Manager**

The easiest way to get started with the full multi-entry experience:

```tsx
import { DiaryManager } from './components/diary/DiaryManager';

export default function DiaryScreen() {
  return <DiaryManager />;
}
```

This gives you:

- Today's entry button
- All entries browser with search
- New entry creation
- Auto-save functionality
- Cross-platform compatibility

### 📝 **Individual Components**

#### Multi-Entry Rich Text Editor

```tsx
import { RichTextEditor } from './components/diary/RichTextEditor';

export default function EditorScreen() {
  return (
    <RichTextEditor
      multiEntryMode={true} // Enable multi-entry system
      entryId="2024-01-15_10-30-00" // Edit specific entry (optional)
      onContentChange={(content) => {
        console.log('Content changed:', content);
      }}
    />
  );
}
```

#### Diary Entries List

```tsx
import { DiaryEntriesList } from './components/diary/DiaryEntriesList';

export default function EntriesScreen() {
  return (
    <DiaryEntriesList
      onEntrySelect={(entryId) => {
        // Navigate to editor with this entry
        console.log('Selected entry:', entryId);
      }}
      onCreateNew={() => {
        // Handle new entry creation
        console.log('Creating new entry');
      }}
    />
  );
}
```

#### Backward Compatible Single Entry

```tsx
import { SimpleDiaryEditor } from './components/diary/DiaryManager';

export default function LegacyDiaryScreen() {
  return <SimpleDiaryEditor />; // Works exactly like the old version
}
```

### 🔧 **Advanced Usage**

#### Using the Multi-Entry Hook

```tsx
import { useDiaryEntries } from '../../utils/useDiaryEntries';

function CustomDiaryComponent() {
  const {
    entries, // All diary entries metadata
    currentEntry, // Currently active entry
    isLoading, // Loading state
    error, // Error state
    createEntry, // Create new entry
    loadEntry, // Load specific entry
    updateCurrentEntryContent, // Update current entry
    deleteEntry, // Delete entry
    getTodaysEntry, // Get or create today's entry
    clearAllEntries, // Delete all entries
    exportAllEntries, // Export all entries as JSON
  } = useDiaryEntries();

  const handleCreateDailyEntry = async () => {
    const todaysEntry = await getTodaysEntry();
    console.log("Today's entry:", todaysEntry);
  };

  const handleCreateTopicEntry = async () => {
    const newEntry = await createEntry('<h1>My Travel Journal</h1><p></p>');
    console.log('Created topic entry:', newEntry);
  };

  return (
    <View>
      <Text>Total Entries: {entries.length}</Text>
      <Text>Current Entry: {currentEntry?.title}</Text>
      <Button title="Today's Entry" onPress={handleCreateDailyEntry} />
      <Button title="New Topic Entry" onPress={handleCreateTopicEntry} />
    </View>
  );
}
```

#### Custom Entry Management

```tsx
import { DiaryStorage, DiaryEntry } from '../../utils/diaryStorage';

// Create a specific entry
const createMeetingNotes = async () => {
  const entryId = await DiaryStorage.createEntry(
    '<h1>Team Meeting - January 15</h1><p>Meeting notes...</p>'
  );
  return entryId;
};

// Load and edit an entry
const editEntry = async (entryId: string) => {
  const entry = await DiaryStorage.loadEntry(entryId);
  if (entry) {
    // Modify content
    entry.content += '<p>Additional notes...</p>';
    await DiaryStorage.updateEntryContent(entryId, entry.content);
  }
};

// Get all entries for custom UI
const buildCustomEntryList = async () => {
  const entries = await DiaryStorage.getAllEntries();
  return entries.map((entry) => ({
    id: entry.id,
    title: entry.title,
    date: new Date(entry.updatedAt).toLocaleDateString(),
    preview: entry.preview,
  }));
};
```

## API Reference

### DiaryStorage (Enhanced)

```typescript
import { DiaryStorage, DiaryEntry, DiaryEntryMetadata } from '../../utils/diaryStorage';

// Multi-entry methods
await DiaryStorage.createEntry(content?: string): Promise<string>
await DiaryStorage.getAllEntries(): Promise<DiaryEntryMetadata[]>
await DiaryStorage.loadEntry(entryId: string): Promise<DiaryEntry | null>
await DiaryStorage.updateEntryContent(entryId: string, content: string): Promise<void>
await DiaryStorage.deleteEntry(entryId: string): Promise<void>
await DiaryStorage.getTodaysEntry(): Promise<DiaryEntry>
await DiaryStorage.clearAllEntries(): Promise<void>
await DiaryStorage.exportAllEntries(): Promise<string>

// Entry management
await DiaryStorage.getCurrentEntryId(): Promise<string | null>
await DiaryStorage.setCurrentEntry(entryId: string): Promise<void>
await DiaryStorage.getEntryFilePath(entryId: string): Promise<string>

// Legacy methods (still supported)
await DiaryStorage.saveDiaryContent(content: string): Promise<void>
await DiaryStorage.loadDiaryContent(): Promise<string>
await DiaryStorage.clearDiaryContent(): Promise<void>
await DiaryStorage.getDiaryFilePath(): Promise<string>

// Utility
DiaryStorage.isWeb(): boolean
```

### DiaryEntry Interface

```typescript
interface DiaryEntry {
  id: string; // Unique identifier (YYYY-MM-DD_HH-MM-SS format)
  title: string; // Auto-generated from content or date
  content: string; // HTML content of the entry
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

interface DiaryEntryMetadata {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  preview: string; // First 100 characters of content (no HTML)
}
```

### useDiaryEntries Hook

```typescript
const {
  // State
  entries: DiaryEntryMetadata[],
  currentEntry: DiaryEntry | null,
  isLoading: boolean,
  error: string | null,

  // Actions
  loadEntries: () => Promise<DiaryEntryMetadata[]>,
  loadEntry: (entryId: string) => Promise<DiaryEntry | null>,
  createEntry: (content?: string) => Promise<DiaryEntry | null>,
  updateCurrentEntryContent: (content: string) => Promise<boolean>,
  deleteEntry: (entryId: string) => Promise<boolean>,
  getTodaysEntry: () => Promise<DiaryEntry | null>,
  clearAllEntries: () => Promise<boolean>,
  exportAllEntries: () => Promise<string | null>,

  // Utilities
  clearError: () => void,
  hasEntries: boolean,
  currentEntryId: string | null,
} = useDiaryEntries();
```

### Component Props

#### DiaryManager

```typescript
interface DiaryManagerProps {
  defaultMode?: 'editor' | 'list'; // Default view mode
  showModeToggle?: boolean; // Show navigation buttons
}
```

#### RichTextEditor

```typescript
interface RichTextEditorProps {
  entryId?: string; // Specific entry to edit
  onContentChange?: (content: string) => void; // Content change callback
  multiEntryMode?: boolean; // Enable multi-entry system (default: true)
}
```

#### DiaryEntriesList

```typescript
interface DiaryEntriesListProps {
  onEntrySelect?: (entryId: string) => void; // Entry selection callback
  onCreateNew?: () => void; // New entry callback
  visible?: boolean; // Visibility control
  onClose?: () => void; // Close callback
}
```

## File Structure

```
components/diary/
├── DiaryManager.tsx              # Complete diary system with navigation
├── RichTextEditor.tsx            # Enhanced editor with multi-entry support
├── DiaryEntriesList.tsx          # Entry browser with search and management
├── DiaryActions.tsx              # Action buttons (export, clear, etc.)
├── InterFontBase64.ts            # Font configuration
└── README.md                     # This documentation

utils/
├── diaryStorage.ts               # Multi-entry storage system
├── useDiaryStorage.ts            # Legacy storage hook
└── useDiaryEntries.ts            # Multi-entry management hook
```

## Entry ID Format

Entry IDs are automatically generated in the format: `YYYY-MM-DD_HH-MM-SS`

Examples:

- `2024-01-15_10-30-45` - Created on Jan 15, 2024 at 10:30:45 AM
- `2024-12-25_14-22-10` - Created on Dec 25, 2024 at 2:22:10 PM

This format ensures:

- **Chronological sorting**
- **Unique identification**
- **Human-readable timestamps**
- **Cross-platform compatibility**

## Migration from Single-Entry

If you're upgrading from the previous single-entry version:

1. **Automatic Migration**: The first time the multi-entry system runs, it will automatically migrate your existing single diary entry
2. **Backward Compatibility**: Use `SimpleDiaryEditor` for the old behavior
3. **No Data Loss**: Existing content is preserved and becomes your first entry
4. **Gradual Adoption**: You can use both systems simultaneously during transition

## Performance Considerations

- **Efficient Loading**: Only entry metadata is loaded initially, full content loaded on demand
- **Debounced Saving**: Prevents excessive writes during typing
- **Indexed Storage**: Fast searching and filtering through entry metadata
- **Lazy Loading**: Editor content only loads when viewing specific entry
- **Memory Management**: Large numbers of entries won't impact performance

## Privacy & Security

- All data is stored locally on the device/browser
- No cloud synchronization (you can add this separately if needed)
- Each entry is stored as a separate file for easy backup
- Cross-platform export capabilities for data portability
- No encryption by default (add if needed for sensitive content)
