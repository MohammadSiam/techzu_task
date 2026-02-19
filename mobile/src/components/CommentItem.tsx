import { View, Text, StyleSheet } from "react-native";
import { Comment } from "../types";
import { Colors, Spacing, FontSize } from "../constants/theme";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const timeAgo = getTimeAgo(new Date(comment.createdAt));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>@{comment.user.username}</Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>
      <Text style={styles.content}>{comment.content}</Text>
    </View>
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
  container: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  username: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.primary,
  },
  time: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  content: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 20,
  },
});
