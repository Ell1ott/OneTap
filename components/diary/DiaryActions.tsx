import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useDiaryStorage } from '../../utils/useDiaryStorage';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

interface DiaryActionsProps {
  currentContent?: string;
  onContentCleared?: () => void;
}

export const DiaryActions: React.FC<DiaryActionsProps> = ({ currentContent, onContentCleared }) => {
  const { saveContent, clearContent, getFilePath, isLoading, error } = useDiaryStorage();

  const handleManualSave = async () => {
    if (!currentContent || currentContent.trim() === '') {
      Alert.alert('Nothing to Save', 'There is no content to save.');
      return;
    }

    const success = await saveContent(currentContent);
    if (success) {
      Alert.alert('Saved', 'Your diary entry has been saved successfully.');
    } else {
      Alert.alert('Save Failed', error || 'Failed to save your diary entry.');
    }
  };

  const handleExport = async () => {
    try {
      const filePath = await getFilePath();
      if (!filePath) {
        Alert.alert('Export Failed', 'Could not get file path for export.');
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (!fileInfo.exists) {
        Alert.alert('No Content', 'No diary content found to export.');
        return;
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/html',
          dialogTitle: 'Export Diary Content',
        });
      } else {
        Alert.alert('Sharing Unavailable', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', 'Failed to export diary content.');
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Content',
      'Are you sure you want to delete all your diary content? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            const success = await clearContent();
            if (success) {
              onContentCleared?.();
              Alert.alert('Cleared', 'All diary content has been deleted.');
            } else {
              Alert.alert('Clear Failed', error || 'Failed to clear diary content.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={handleManualSave}
        disabled={isLoading}>
        <Text style={styles.buttonText}>Manual Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.exportButton]}
        onPress={handleExport}
        disabled={isLoading}>
        <Text style={styles.buttonText}>Export</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.clearButton]}
        onPress={handleClearAll}
        disabled={isLoading}>
        <Text style={styles.buttonText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  exportButton: {
    backgroundColor: '#2196F3',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
