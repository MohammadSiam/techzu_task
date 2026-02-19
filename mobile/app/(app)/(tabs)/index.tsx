import { useState, useCallback } from "react";
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import { useGetPostsQuery } from "../../../src/features/apiSlice";
import PostCard from "../../../src/components/PostCard";
import { Colors, Spacing, FontSize } from "../../../src/constants/theme";
import { Post } from "../../../src/types";

export default function Feed() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetPostsQuery({
    page,
    limit: 10,
    username: filter || undefined,
  });

  const posts = data?.data || [];
  const pagination = data?.pagination;
  const hasMore = pagination ? page < pagination.totalPages : false;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const onEndReached = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((p) => p + 1);
    }
  }, [hasMore, isFetching]);

  const onFilterChange = useCallback((text: string) => {
    setFilter(text);
    setPage(1);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => <PostCard post={item} />,
    []
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.filterInput}
        placeholder="Filter by username..."
        value={filter}
        onChangeText={onFilterChange}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {isLoading && page === 1 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching && page > 1 ? (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={styles.footer}
              />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No posts yet</Text>
              <Text style={styles.emptySubtext}>
                Be the first to share something!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: FontSize.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  list: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: FontSize.xl,
    fontWeight: "600",
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  footer: {
    paddingVertical: Spacing.md,
  },
});
