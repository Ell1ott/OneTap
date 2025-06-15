import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { RichTextEditor } from './RichTextEditor';
import { DiaryEntriesList } from './DiaryEntriesList';
import { useDiaryEntries } from '../../utils/useDiaryEntries';

interface DiaryManagerProps {
  defaultMode?: 'editor' | 'list';
  showModeToggle?: boolean;
}

export const DiaryManager: React.FC<DiaryManagerProps> = ({
  defaultMode = 'editor',
  showModeToggle = true,
}) => {
  const [currentMode, setCurrentMode] = useState<'editor' | 'list'>(defaultMode);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [showEntriesList, setShowEntriesList] = useState(false);

  const { hasEntries, getTodaysEntry } = useDiaryEntries();

  const handleEntrySelect = (entryId: string) => {
    setSelectedEntryId(entryId);
    setCurrentMode('editor');
    setShowEntriesList(false);
  };

  const handleCreateNew = () => {
    setSelectedEntryId(null); // This will create a new entry
    setCurrentMode('editor');
    setShowEntriesList(false);
  };

  const handleShowList = () => {
    if (hasEntries) {
      setShowEntriesList(true);
    } else {
      Alert.alert(
        'No Entries',
        "You haven't created any diary entries yet. Would you like to create your first entry?",
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Create Entry', onPress: handleCreateNew },
        ]
      );
    }
  };

  const handleTodaysEntry = async () => {
    const todaysEntry = await getTodaysEntry();
    if (todaysEntry) {
      setSelectedEntryId(todaysEntry.id);
      setCurrentMode('editor');
    }
  };

  const renderModeToggle = () => {
    if (!showModeToggle) return null;

    return (
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, currentMode === 'editor' && styles.toggleButtonActive]}
          onPress={handleTodaysEntry}>
          <Text
            style={[
              styles.toggleButtonText,
              currentMode === 'editor' && styles.toggleButtonTextActive,
            ]}>
            Today&apos;s Entry
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.toggleButton, styles.listButton]} onPress={handleShowList}>
          <Text style={styles.toggleButtonText}>All Entries ({hasEntries ? 'View' : 'Empty'})</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.toggleButton, styles.newButton]} onPress={handleCreateNew}>
          <Text style={styles.toggleButtonText}>New Entry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    if (currentMode === 'list') {
      return (
        <DiaryEntriesList
          onEntrySelect={handleEntrySelect}
          onCreateNew={handleCreateNew}
          visible={true}
          onClose={() => setCurrentMode('editor')}
        />
      );
    }

    return (
      <RichTextEditor
        entryId={selectedEntryId || undefined}
        multiEntryMode={true}
        onContentChange={(content) => {
          // Optional: Handle content changes for real-time updates
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderModeToggle()}
      {renderContent()}

      {/* Modal for entries list */}
      {showEntriesList && (
        <DiaryEntriesList
          onEntrySelect={handleEntrySelect}
          onCreateNew={handleCreateNew}
          visible={showEntriesList}
          onClose={() => setShowEntriesList(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#2196F3',
  },
  listButton: {
    backgroundColor: '#4CAF50',
  },
  newButton: {
    backgroundColor: '#FF9800',
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
});

// Export a simple version for backward compatibility
export const SimpleDiaryEditor: React.FC = () => {
  return <RichTextEditor multiEntryMode={false} />;
};

// Export the list component for standalone use
export { DiaryEntriesList } from './DiaryEntriesList';

// Export the editor for standalone use
export { RichTextEditor } from './RichTextEditor';
