import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  FlatList,
  Alert,
  RefreshControl,
  Image,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/lib/api';
import { useAuth } from '../../src/contexts/AuthContext';
import { Bookmark, Comment } from '../../src/types';

export default function BookmarkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liking, setLiking] = useState(false);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!id) return;
      isRefresh ? setRefreshing(true) : setLoading(true);
      try {
        const [bkRes, cmtRes] = await Promise.all([
          api.get(`/bookmarks/${id}`),
          api.get(`/bookmarks/${id}/comments`),
        ]);
        setBookmark(bkRes.data.data);
        setComments(cmtRes.data.data ?? []);
      } catch {
        Alert.alert('Error', 'Could not load bookmark');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleLike() {
    if (!bookmark || liking) return;
    setLiking(true);
    try {
      await api.post(`/bookmarks/${bookmark.id}/like`);
      setBookmark((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              _count: {
                ...prev._count,
                likes: (prev._count?.likes ?? 0) + (prev.isLiked ? -1 : 1),
                comments: prev._count?.comments ?? 0,
              },
            }
          : prev,
      );
    } catch {
      Alert.alert('Error', 'Could not like bookmark');
    } finally {
      setLiking(false);
    }
  }

  async function handleComment() {
    if (!commentText.trim() || !bookmark) return;
    setSubmittingComment(true);
    try {
      const { data } = await api.post(`/bookmarks/${bookmark.id}/comment`, {
        content: commentText.trim(),
      });
      setComments((prev) => [data.data, ...prev]);
      setCommentText('');
    } catch {
      Alert.alert('Error', 'Could not post comment');
    } finally {
      setSubmittingComment(false);
    }
  }

  async function handleDelete() {
    if (!bookmark) return;
    Alert.alert('Delete Bookmark', 'Are you sure you want to delete this bookmark?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/bookmarks/${bookmark.id}`);
            router.back();
          } catch {
            Alert.alert('Error', 'Could not delete bookmark');
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!bookmark) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Bookmark not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwner = user?.id === bookmark.userId;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Bookmark',
          headerRight: isOwner
            ? () => (
                <TouchableOpacity onPress={handleDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="trash-outline" size={22} color="#FF5757" />
                </TouchableOpacity>
              )
            : undefined,
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.inner}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchData(true)}
            tintColor="#6C63FF"
            colors={['#6C63FF']}
          />
        }
      >
        {/* Preview image */}
        {bookmark.imageUrl ? (
          <Image
            source={{ uri: bookmark.imageUrl }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        ) : null}

        {/* Main card */}
        <View style={styles.card}>
          <Text style={styles.title}>{bookmark.title}</Text>

          <TouchableOpacity
            style={styles.urlRow}
            onPress={() => Linking.openURL(bookmark.url)}
            activeOpacity={0.7}
          >
            <Ionicons name="link-outline" size={14} color="#6C63FF" />
            <Text style={styles.url} numberOfLines={1}>
              {bookmark.url}
            </Text>
            <Ionicons name="open-outline" size={14} color="#6C63FF" />
          </TouchableOpacity>

          {bookmark.description ? (
            <Text style={styles.description}>{bookmark.description}</Text>
          ) : null}

          {/* Tags */}
          {bookmark.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {bookmark.tags.map(({ tag }) => (
                <View key={tag.id} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Author & date */}
          <View style={styles.meta}>
            <View style={styles.authorRow}>
              <View style={styles.authorAvatar}>
                <Text style={styles.authorInitial}>
                  {(bookmark.user.displayName ?? bookmark.user.username)[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.authorName}>
                {bookmark.user.displayName ?? bookmark.user.username}
              </Text>
              <Text style={styles.authorUsername}> · @{bookmark.user.username}</Text>
            </View>
            <Text style={styles.date}>
              {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Like & comment counts */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, bookmark.isLiked && styles.actionBtnActive]}
              onPress={handleLike}
              disabled={liking}
              activeOpacity={0.7}
            >
              <Ionicons
                name={bookmark.isLiked ? 'heart' : 'heart-outline'}
                size={18}
                color={bookmark.isLiked ? '#FF5757' : '#888'}
              />
              <Text style={[styles.actionText, bookmark.isLiked && styles.actionTextActive]}>
                {bookmark._count?.likes ?? 0}
              </Text>
            </TouchableOpacity>

            <View style={styles.actionBtn}>
              <Ionicons name="chatbubble-outline" size={18} color="#888" />
              <Text style={styles.actionText}>{bookmark._count?.comments ?? 0}</Text>
            </View>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Linking.openURL(bookmark.url)}
              activeOpacity={0.7}
            >
              <Ionicons name="open-outline" size={18} color="#6C63FF" />
              <Text style={[styles.actionText, { color: '#6C63FF' }]}>Open</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add comment */}
        <View style={styles.commentInputCard}>
          <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Write a comment..."
              placeholderTextColor="#bbb"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.commentSubmit,
                (!commentText.trim() || submittingComment) && styles.commentSubmitDisabled,
              ]}
              onPress={handleComment}
              disabled={!commentText.trim() || submittingComment}
              activeOpacity={0.8}
            >
              {submittingComment ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments list */}
        {comments.map((comment) => (
          <View key={comment.id} style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarText}>
                  {(comment.user.displayName ?? comment.user.username)[0].toUpperCase()}
                </Text>
              </View>
              <View style={styles.commentMeta}>
                <Text style={styles.commentAuthor}>
                  {comment.user.displayName ?? comment.user.username}
                </Text>
                <Text style={styles.commentDate}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <Text style={styles.commentContent}>{comment.content}</Text>
          </View>
        ))}

        {comments.length === 0 && (
          <View style={styles.noComments}>
            <Text style={styles.noCommentsText}>No comments yet. Be the first!</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F7FF',
  },
  errorText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6C63FF',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF',
  },
  inner: {
    paddingBottom: 40,
  },
  previewImage: {
    width: '100%',
    height: 200,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 10,
    lineHeight: 26,
  },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F4F3FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  url: {
    flex: 1,
    fontSize: 12,
    color: '#6C63FF',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F0EEFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInitial: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  authorUsername: {
    fontSize: 12,
    color: '#999',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F8F7FF',
  },
  actionBtnActive: {
    backgroundColor: '#FFF0F0',
  },
  actionText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  actionTextActive: {
    color: '#FF5757',
  },
  commentInputCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A1A2E',
    maxHeight: 100,
    backgroundColor: '#FAFAFA',
  },
  commentSubmit: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentSubmitDisabled: {
    backgroundColor: '#C4C1FF',
  },
  commentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  commentMeta: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  commentDate: {
    fontSize: 11,
    color: '#bbb',
  },
  commentContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  noCommentsText: {
    fontSize: 14,
    color: '#bbb',
  },
});
