import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Bookmark } from '../types';

interface BookmarkCardProps {
  bookmark: Bookmark;
  showUser?: boolean;
}

export default function BookmarkCard({ bookmark, showUser = true }: BookmarkCardProps) {
  const domainFromUrl = (url: string): string => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  function handlePress() {
    router.push(`/bookmark/${bookmark.id}`);
  }

  function handleOpenUrl(e: any) {
    e.stopPropagation?.();
    Linking.openURL(bookmark.url);
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {/* Image preview */}
      {bookmark.imageUrl ? (
        <Image
          source={{ uri: bookmark.imageUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.content}>
        {/* Header row */}
        {showUser && (
          <View style={styles.authorRow}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitial}>
                {(bookmark.user.displayName ?? bookmark.user.username)[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.authorName}>
              {bookmark.user.displayName ?? bookmark.user.username}
            </Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.authorUsername}>@{bookmark.user.username}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {bookmark.title}
        </Text>

        {/* URL pill */}
        <TouchableOpacity style={styles.urlPill} onPress={handleOpenUrl} activeOpacity={0.7}>
          <Ionicons name="globe-outline" size={11} color="#6C63FF" />
          <Text style={styles.urlText} numberOfLines={1}>
            {domainFromUrl(bookmark.url)}
          </Text>
        </TouchableOpacity>

        {/* Description */}
        {bookmark.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {bookmark.description}
          </Text>
        ) : null}

        {/* Tags */}
        {bookmark.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {bookmark.tags.slice(0, 4).map(({ tag }) => (
              <View key={tag.id} style={styles.tag}>
                <Text style={styles.tagText}>#{tag.name}</Text>
              </View>
            ))}
            {bookmark.tags.length > 4 && (
              <Text style={styles.moreTags}>+{bookmark.tags.length - 4}</Text>
            )}
          </View>
        )}

        {/* Footer: stats + date */}
        <View style={styles.footer}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons
                name={bookmark.isLiked ? 'heart' : 'heart-outline'}
                size={13}
                color={bookmark.isLiked ? '#FF5757' : '#bbb'}
              />
              <Text style={styles.statText}>{bookmark._count?.likes ?? 0}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="chatbubble-outline" size={13} color="#bbb" />
              <Text style={styles.statText}>{bookmark._count?.comments ?? 0}</Text>
            </View>
          </View>
          <Text style={styles.date}>
            {new Date(bookmark.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 14,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  authorAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInitial: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  authorName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  dot: {
    color: '#bbb',
    fontSize: 12,
  },
  authorUsername: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    lineHeight: 22,
    marginBottom: 6,
  },
  urlPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F4F3FF',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
    maxWidth: '80%',
  },
  urlText: {
    fontSize: 11,
    color: '#6C63FF',
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#F0EEFF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: '#6C63FF',
    fontWeight: '600',
  },
  moreTags: {
    fontSize: 11,
    color: '#999',
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#bbb',
    fontWeight: '600',
  },
  date: {
    fontSize: 11,
    color: '#ccc',
  },
});
