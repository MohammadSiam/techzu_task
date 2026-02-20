import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useCreatePostMutation } from "../../../src/features/apiSlice";
import { Colors, Spacing, FontSize } from "../../../src/constants/theme";
import AppTextArea from "../../../src/components/AppTextArea";

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
        <AppTextArea
          label="What's on your mind?"
          placeholder="Share something with the community..."
          value={content}
          onChangeText={setContent}
          maxLength={MAX_LENGTH}
          style={styles.textarea}
        />

        <TouchableOpacity
          style={[styles.button, (isLoading || !content.trim()) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading || !content.trim()}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Posting..." : "Post"}
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
  inner: {
    flex: 1,
    padding: Spacing.md,
  },
  textarea: {
    minHeight: 200,
    maxHeight: 400,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: FontSize.lg,
    fontWeight: "600",
  },
});
