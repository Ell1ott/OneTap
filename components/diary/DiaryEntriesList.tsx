import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useDiaryEntries } from '../../utils/useDiaryEntries';
import { DiaryEntryMetadata } from '../../utils/diaryStorage';

interface DiaryEntriesListProps {
  onEntrySelect?: (entryId: string) => void;
  onCreateNew?: () => void;
  visible?: boolean;
  onClose?: () => void;
}

export const DiaryEntriesList: React.FC<DiaryEntriesListProps> = ({
  onEntrySelect,
  onCreateNew,
  visible = true,
  onClose,
}) => {
  const {
    entries,
    isLoading,
    error,
    loadEntry,
    deleteEntry,
    createEntry,
    getTodaysEntry,
    clearAllEntries,
    exportAllEntries,
  } = useDiaryEntries();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntryMetadata[]>([]);

  // Filter entries based on search query
  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.preview.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEntries(filtered);
    }
  }, [entries, searchQuery]);

  const handleEntrySelect = async (entryId: string) => {
    await loadEntry(entryId);
    if (onEntrySelect) {
      onEntrySelect(entryId);
    }
  };

  const handleDeleteEntry = (entryId: string, title: string) => {
    Alert.alert(
      'Delete Entry',
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEntry(entryId),
        },
      ]
    );
  };

  const handleCreateNew = async () => {
    await createEntry();
    if (onCreateNew) {
      onCreateNew();
    }
  };

  const handleTodaysEntry = async () => {
    const todaysEntry = await getTodaysEntry();
    if (todaysEntry && onEntrySelect) {
      onEntrySelect(todaysEntry.id);
    }
  };

  const handleExportAll = async () => {
    const exportData = await exportAllEntries();
    if (exportData) {
      if (typeof window !== 'undefined') {
        // Web: Download as JSON file
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diary-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        Alert.alert('Export Successful', 'Your diary has been downloaded as JSON.');
      } else {
        // Mobile: Could implement native sharing here
        Alert.alert(
          'Export Successful',
          'Export data is ready (implement native sharing if needed).'
        );
      }
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Entries',
      'Are you sure you want to delete ALL diary entries? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => clearAllEntries(),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderEntry = ({ item }: { item: DiaryEntryMetadata }) => (
    <View style={styles.entryItem}>
      <TouchableOpacity style={styles.entryContent} onPress={() => handleEntrySelect(item.id)}>
        <Text style={styles.entryTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.entryPreview} numberOfLines={2}>
          {item.preview}
        </Text>
        <Text style={styles.entryDate}>Updated: {formatDate(item.updatedAt)}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteEntry(item.id, item.title)}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Diary Entries</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search entries..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleTodaysEntry}>
          <Text style={styles.actionButtonText}>Today&apos;s Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleCreateNew}>
          <Text style={styles.actionButtonText}>New Entry</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.exportButton} onPress={handleExportAll}>
          <Text style={styles.actionButtonText}>Export All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
          <Text style={styles.actionButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No diary entries yet</Text>
      <TouchableOpacity style={styles.createFirstButton} onPress={handleCreateNew}>
        <Text style={styles.createFirstButtonText}>Create Your First Entry</Text>
      </TouchableOpacity>
    </View>
  );

  const content = (
    <View style={styles.container}>
      {renderHeader()}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <FlatList
        data={filteredEntries}
        renderItem={renderEntry}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (visible && onClose) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        {content}
      </Modal>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  exportButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  listContainer: {
    flexGrow: 1,
    padding: 16,
  },
  entryItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  entryContent: {
    flex: 1,
    padding: 16,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  entryPreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  entryDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f44336',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  createFirstButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 6,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 24,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
