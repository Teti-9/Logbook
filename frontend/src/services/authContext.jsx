import {
  createContext,
  useContext,
  // useState,
  useCallback,
  // useEffect,
} from "react";
// import { getAccessToken, setSessionToken, clearSessionToken, logoutSession, refreshSession } from '../services/auth.js'
import { authClient } from "../auth-client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const {
    data: session,
    isPending: loading,
    refetch,
  } = authClient.useSession();

  // const [token, setToken] = useState(getAccessToken());
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   let ignore = false;

  //   async function init() {
  //     const refreshedToken = await refreshSession();

  //     if (ignore) return;

  //     if (refreshedToken) setToken(refreshedToken);
  //     setLoading(false);
  //   }
  //   init();

  //   return () => {
  //     ignore = true;
  //   };
  // }, []);

  // const login = useCallback((accessToken) => {
  //   setSessionToken(accessToken);
  //   setToken(getAccessToken());
  // }, []);

  // const logout = useCallback(async () => {
  //   await logoutSession();
  //   setToken(getAccessToken());
  // }, []);

  // const clearAuth = useCallback(() => {
  //   clearSessionToken();
  //   setToken(getAccessToken());
  // }, []);

  const login = useCallback(async ({ email, password }) => {
    return authClient.signIn.email({ email, password });
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    return authClient.signUp.email({ name, email, password });
  }, []);

  const logout = useCallback(async () => {
    const result = await authClient.signOut();
    await refetch();
    return result;
  }, [refetch]);

  const clearAuth = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // return (
  //   <AuthContext.Provider
  //     value={{
  //       token,
  //       isAuthenticated: !!token,
  //       loading,
  //       login,
  //       logout,
  //       clearAuth,
  //     }}
  //   >
  //     {children}
  //   </AuthContext.Provider>
  // );

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        isAuthenticated: Boolean(session?.user),
        loading,
        login,
        register,
        logout,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
