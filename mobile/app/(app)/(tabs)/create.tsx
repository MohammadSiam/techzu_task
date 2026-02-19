import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useCreatePostMutation } from "../../../src/features/apiSlice";
import { Colors, Spacing, FontSize } from "../../../src/constants/theme";

const MAX_LENGTH = 500;

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [createPost, { isLoading }] = useCreatePostMutation();
  const router = useRouter();

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      Alert.alert("Error", "Post content cannot be empty");
      return;
    }

    try {
      const result = await createPost({ content: trimmed }).unwrap();
      if (result.success) {
        setContent("");
        router.navigate("/(app)/(tabs)");
      } else {
        Alert.alert("Error", result.error || "Failed to create post");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.data?.error || "Failed to create post");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Create Post</Text>

        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor={Colors.text}
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={MAX_LENGTH}
          textAlignVertical="top"
        />

        <View style={styles.footer}>
          <Text style={styles.charCount}>
            {content.length}/{MAX_LENGTH}
          </Text>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading || !content.trim()}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Posting..." : "Post"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: FontSize.lg,
    lineHeight: 24,
    maxHeight: 300,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  charCount: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFF",
    fontSize: FontSize.lg,
    fontWeight: "600",
  },
});
