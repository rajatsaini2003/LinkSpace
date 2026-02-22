import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../src/lib/api';
import { Bookmark } from '../../src/types';
import BookmarkCard from '../../src/components/BookmarkCard';

type FeedTab = 'trending' | 'following';

export default function FeedScreen() {
  const [activeTab, setActiveTab] = useState<FeedTab>('trending');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchFeed = useCallback(
    async (tab: FeedTab, pageNum: number, refresh = false) => {
      if (pageNum === 1) {
        refresh ? setRefreshing(true) : setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const endpoint = tab === 'trending' ? '/feed/trending' : '/feed/following';
        const { data } = await api.get(endpoint, { params: { page: pageNum, limit: 20 } });
        const items: Bookmark[] = data.data ?? [];
        const pagination = data.pagination;

        if (pageNum === 1) {
          setBookmarks(items);
        } else {
          setBookmarks((prev) => [...prev, ...items]);
        }

        setHasMore(pagination ? pageNum < pagination.totalPages : items.length === 20);
        setPage(pageNum);
      } catch {
        // silently handle errors
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setHasMore(true);
      fetchFeed(activeTab, 1);
    }, [activeTab, fetchFeed]),
  );

  function handleTabChange(tab: FeedTab) {
    setActiveTab(tab);
    setPage(1);
    setHasMore(true);
    fetchFeed(tab, 1);
  }

  function handleRefresh() {
    setPage(1);
    setHasMore(true);
    fetchFeed(activeTab, 1, true);
  }

  function handleLoadMore() {
    if (!loadingMore && hasMore) {
      fetchFeed(activeTab, page + 1);
    }
  }

  function renderFooter() {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#6C63FF" />
      </View>
    );
  }

  function renderEmpty() {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📌</Text>
        <Text style={styles.emptyTitle}>Nothing here yet</Text>
        <Text style={styles.emptyText}>
          {activeTab === 'following'
            ? 'Follow people to see their bookmarks here'
            : 'Trending bookmarks will appear here'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
          onPress={() => handleTabChange('trending')}
        >
          <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText]}>
            🔥 Trending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'following' && styles.activeTab]}
          onPress={() => handleTabChange('following')}
        >
          <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>
            👥 Following
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookmarkCard bookmark={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#6C63FF"
              colors={['#6C63FF']}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6C63FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#6C63FF',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});
