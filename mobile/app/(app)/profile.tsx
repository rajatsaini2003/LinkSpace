import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/lib/api';
import { useAuth } from '../../src/contexts/AuthContext';
import { Bookmark, User } from '../../src/types';
import BookmarkCard from '../../src/components/BookmarkCard';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = useCallback(
    async (isRefresh = false) => {
      if (!user?.username) return;
      isRefresh ? setRefreshing(true) : setLoading(true);
      try {
        const [profileRes, bookmarksRes] = await Promise.all([
          api.get(`/user/${user.username}`),
          api.get('/bookmarks', { params: { userId: user.id, limit: 50, page: 1 } }),
        ]);
        setProfile(profileRes.data.data);
        setBookmarks(bookmarksRes.data.data ?? []);
      } catch {
        // handle silently
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user],
  );

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile]),
  );

  async function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  const displayUser = profile ?? user;

  const ListHeader = (
    <View style={styles.header}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {displayUser?.avatarUrl ? (
          <Image source={{ uri: displayUser.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {(displayUser?.displayName ?? displayUser?.username ?? 'U')[0].toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.displayName}>
        {displayUser?.displayName ?? displayUser?.username}
      </Text>
      <Text style={styles.username}>@{displayUser?.username}</Text>

      {displayUser?.bio ? <Text style={styles.bio}>{displayUser.bio}</Text> : null}

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{displayUser?._count?.bookmarks ?? bookmarks.length}</Text>
          <Text style={styles.statLabel}>Bookmarks</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{displayUser?._count?.followers ?? 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{displayUser?._count?.following ?? 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={16} color="#FF5757" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>My Bookmarks</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <FlatList
      data={bookmarks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BookmarkCard bookmark={item} showUser={false} />}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchProfile(true)}
          tintColor="#6C63FF"
          colors={['#6C63FF']}
        />
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📌</Text>
          <Text style={styles.emptyText}>No bookmarks yet</Text>
        </View>
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F7FF',
  },
  list: {
    backgroundColor: '#F8F7FF',
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    marginBottom: 8,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: '#6C63FF',
  },
  avatarPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
  },
  displayName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  username: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 24,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F0F0F0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE0E0',
    backgroundColor: '#FFF5F5',
  },
  logoutText: {
    fontSize: 14,
    color: '#FF5757',
    fontWeight: '600',
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginTop: 20,
    marginLeft: 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  separator: {
    height: 12,
    marginHorizontal: 16,
  },
});
