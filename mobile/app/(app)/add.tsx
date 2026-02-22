import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import api from '../../src/lib/api';
import AuthInput from '../../src/components/AuthInput';

export default function AddBookmarkScreen() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  async function handleSuggestTags() {
    if (!title.trim() && !url.trim()) {
      Alert.alert('Error', 'Please enter a title or URL first');
      return;
    }
    setFetching(true);
    try {
      const { data } = await api.post('/ai/suggest-tags', {
        title: title.trim() || url.trim(),
        description: description.trim() || undefined,
        url: url.trim() || undefined,
      });
      const suggested: string[] = data.data?.tags ?? [];
      if (suggested.length > 0) {
        const current = tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
        const merged = Array.from(new Set([...current, ...suggested]));
        setTags(merged.join(', '));
      } else {
        Alert.alert('Notice', 'No tag suggestions available for this content.');
      }
    } catch {
      Alert.alert('Notice', 'Could not suggest tags. Please add them manually.');
    } finally {
      setFetching(false);
    }
  }

  async function handleSubmit() {
    if (!url.trim()) {
      Alert.alert('Error', 'URL is required');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const tagList = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    setLoading(true);
    try {
      const { data } = await api.post('/bookmarks', {
        url: url.trim(),
        title: title.trim(),
        description: description.trim() || undefined,
        tags: tagList,
        isPublic,
      });
      Alert.alert('Success', 'Bookmark saved!', [
        {
          text: 'View',
          onPress: () => router.push(`/bookmark/${data.data.id}`),
        },
        {
          text: 'Add another',
          onPress: () => {
            setUrl('');
            setTitle('');
            setDescription('');
            setTags('');
            setIsPublic(true);
          },
        },
      ]);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Failed to save bookmark';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Link</Text>

        <View style={styles.urlRow}>
          <View style={styles.urlInputWrapper}>
            <AuthInput
              label="URL *"
              value={url}
              onChangeText={setUrl}
              placeholder="https://example.com"
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Details</Text>

        <AuthInput
          label="Title *"
          value={title}
          onChangeText={setTitle}
          placeholder="Bookmark title"
        />

        <AuthInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Brief description (optional)"
          multiline
          numberOfLines={3}
        />

        <View style={styles.urlRow}>
          <View style={styles.urlInputWrapper}>
            <AuthInput
              label="Tags"
              value={tags}
              onChangeText={setTags}
              placeholder="react, design, productivity"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity
            style={[styles.fetchButton, fetching && styles.fetchButtonDisabled]}
            onPress={handleSuggestTags}
            disabled={fetching}
            activeOpacity={0.8}
          >
            {fetching ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.fetchButtonText}>AI Tags</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Public bookmark</Text>
            <Text style={styles.toggleHint}>
              {isPublic ? 'Visible to everyone' : 'Only visible to you'}
            </Text>
          </View>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: '#ddd', true: '#C4C1FF' }}
            thumbColor={isPublic ? '#6C63FF' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Bookmark</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF',
  },
  inner: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 16,
  },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  urlInputWrapper: {
    flex: 1,
  },
  fetchButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  fetchButtonDisabled: {
    opacity: 0.7,
  },
  fetchButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  toggleHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
