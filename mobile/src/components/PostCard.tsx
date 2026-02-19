import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Post } from "../types";
import { useToggleLikeMutation } from "../features/apiSlice";
import { Colors, Spacing, FontSize } from "../constants/theme";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [toggleLike] = useToggleLikeMutation();

  const timeAgo = getTimeAgo(new Date(post.createdAt));

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(app)/post/${post.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.username}>@{post.user.username}</Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleLike(post.id);
          }}
        >
          <Text style={[styles.actionIcon, post.isLiked && styles.liked]}>
            {post.isLiked ? "♥" : "♡"}
          </Text>
          <Text style={[styles.actionText, post.isLiked && styles.liked]}>
            {post.likesCount}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{post.commentsCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  username: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.primary,
  },
  time: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  content: {
    fontSize: FontSize.lg,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.lg,
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
});
