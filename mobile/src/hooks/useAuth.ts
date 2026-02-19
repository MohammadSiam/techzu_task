import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { setCredentials, logout as logoutAction } from "../features/authSlice";
import { clearTokens } from "../lib/secureStorage";
import { apiSlice } from "../features/apiSlice";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const logOut = async () => {
    await clearTokens();
    dispatch(logoutAction());
    dispatch(apiSlice.util.resetApiState());
  };

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    dispatch,
    setCredentials,
    logout: logOut,
  };
}
