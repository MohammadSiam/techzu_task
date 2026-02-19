import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  useGetPostQuery,
  useGetCommentsQuery,
  useAddCommentMutation,
  useToggleLikeMutation,
} from "../../../src/features/apiSlice";
import CommentItem from "../../../src/components/CommentItem";
import { Colors, Spacing, FontSize } from "../../../src/constants/theme";
import { Comment } from "../../../src/types";

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [commentPage, setCommentPage] = useState(1);
  const [commentText, setCommentText] = useState("");

  const { data: postData, isLoading: postLoading } = useGetPostQuery(id!);
  const { data: commentsData, isFetching: commentsFetching } =
    useGetCommentsQuery({ postId: id!, page: commentPage });
  const [addComment, { isLoading: commenting }] = useAddCommentMutation();
  const [toggleLike] = useToggleLikeMutation();

  const post = postData?.data;
  const comments = commentsData?.data || [];
  const commentPagination = commentsData?.pagination;
  const hasMoreComments = commentPagination
    ? commentPage < commentPagination.totalPages
    : false;

  const handleComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    try {
      const result = await addComment({
        postId: id!,
        content: trimmed,
      }).unwrap();
      if (result.success) {
        setCommentText("");
        setCommentPage(1);
      }
    } catch (err: any) {
      Alert.alert("Error", err?.data?.error || "Failed to add comment");
    }
  };

  const loadMoreComments = useCallback(() => {
    if (hasMoreComments && !commentsFetching) {
      setCommentPage((p) => p + 1);
    }
  }, [hasMoreComments, commentsFetching]);

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => <CommentItem comment={item} />,
    []
  );

  if (postLoading || !post) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.postSection}>
            <View style={styles.postHeader}>
              <Text style={styles.username}>@{post.user.username}</Text>
              <Text style={styles.time}>
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => toggleLike(post.id)}
              >
                <Text
                  style={[styles.actionIcon, post.isLiked && styles.liked]}
                >
                  {post.isLiked ? "♥" : "♡"}
                </Text>
                <Text
                  style={[styles.actionText, post.isLiked && styles.liked]}
                >
                  {post.likesCount} likes
                </Text>
              </TouchableOpacity>

              <View style={styles.actionButton}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>
                  {post.commentsCount} comments
                </Text>
              </View>
            </View>

            <Text style={styles.commentsTitle}>Comments</Text>
          </View>
        }
        onEndReached={loadMoreComments}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          commentsFetching ? (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
              style={styles.footer}
            />
          ) : null
        }
        ListEmptyComponent={
          !commentsFetching ? (
            <Text style={styles.noComments}>No comments yet</Text>
          ) : null
        }
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={commentText}
          onChangeText={setCommentText}
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, commenting && styles.sendDisabled]}
          onPress={handleComment}
          disabled={commenting || !commentText.trim()}
        >
          <Text style={styles.sendText}>
            {commenting ? "..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: Spacing.md,
  },
  postSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  username: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.primary,
  },
  time: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  postContent: {
    fontSize: FontSize.lg,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  actionIcon: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  actionText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  liked: {
    color: Colors.like,
  },
  commentsTitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.text,
  },
  noComments: {
    textAlign: "center",
    color: Colors.textSecondary,
    paddingVertical: Spacing.lg,
    fontSize: FontSize.md,
  },
  footer: {
    paddingVertical: Spacing.md,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  commentInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    fontSize: FontSize.md,
    marginRight: Spacing.sm,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
  },
  sendDisabled: {
    opacity: 0.6,
  },
  sendText: {
    color: "#FFF",
    fontSize: FontSize.md,
    fontWeight: "600",
  },
});
