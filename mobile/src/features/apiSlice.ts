import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { setTokens, logout } from "./authSlice";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../lib/secureStorage";
import {
  ApiResponse,
  AuthResponse,
  TokenResponse,
  Post,
  Comment,
  LikeResponse,
  PaginationMeta,
} from "../types";

// Change this to your machine's local IP when testing on device
const BASE_URL = "http://localhost:3000";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      const data = refreshResult.data as ApiResponse<TokenResponse> | undefined;

      if (data?.success && data.data) {
        await setAccessToken(data.data.accessToken);
        await setRefreshToken(data.data.refreshToken);
        api.dispatch(
          setTokens({
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          })
        );
        result = await baseQuery(args, api, extraOptions);
      } else {
        await clearTokens();
        api.dispatch(logout());
      }
    } else {
      await clearTokens();
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Post", "Posts", "Comments"],
  endpoints: (builder) => ({
    // Auth
    signup: builder.mutation<
      ApiResponse<AuthResponse>,
      { username: string; email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/signup", method: "POST", body }),
    }),

    login: builder.mutation<
      ApiResponse<AuthResponse>,
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),

    // Posts
    getPosts: builder.query<
      ApiResponse<Post[]>,
      { page: number; limit?: number; username?: string }
    >({
      query: ({ page, limit = 10, username }) => ({
        url: "/posts",
        params: { page, limit, ...(username ? { username } : {}) },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs.username || "feed";
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        if (currentCache.data && newItems.data) {
          return {
            ...newItems,
            data: [...currentCache.data, ...newItems.data],
          };
        }
        return newItems;
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
      providesTags: ["Posts"],
    }),

    getPost: builder.query<ApiResponse<Post>, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),

    createPost: builder.mutation<ApiResponse<Post>, { content: string }>({
      query: (body) => ({ url: "/posts", method: "POST", body }),
      invalidatesTags: ["Posts"],
    }),

    toggleLike: builder.mutation<ApiResponse<LikeResponse>, string>({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: "POST",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        // Optimistic update for feed
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getPosts",
            { page: 1 } as any,
            (draft) => {
              if (draft.data) {
                const post = draft.data.find((p) => p.id === postId);
                if (post) {
                  post.isLiked = !post.isLiked;
                  post.likesCount += post.isLiked ? 1 : -1;
                }
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),

    // Comments
    getComments: builder.query<
      ApiResponse<Comment[]>,
      { postId: string; page: number; limit?: number }
    >({
      query: ({ postId, page, limit = 10 }) => ({
        url: `/posts/${postId}/comments`,
        params: { page, limit },
      }),
      serializeQueryArgs: ({ queryArgs }) => queryArgs.postId,
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        if (currentCache.data && newItems.data) {
          return {
            ...newItems,
            data: [...currentCache.data, ...newItems.data],
          };
        }
        return newItems;
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
      providesTags: (_result, _error, { postId }) => [
        { type: "Comments", id: postId },
      ],
    }),

    addComment: builder.mutation<
      ApiResponse<Comment>,
      { postId: string; content: string }
    >({
      query: ({ postId, content }) => ({
        url: `/posts/${postId}/comment`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Comments", id: postId },
        { type: "Post", id: postId },
        "Posts",
      ],
    }),

    // FCM
    updateFcmToken: builder.mutation<ApiResponse, { fcmToken: string }>({
      query: (body) => ({
        url: "/users/me/fcm-token",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useToggleLikeMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateFcmTokenMutation,
} = apiSlice;
