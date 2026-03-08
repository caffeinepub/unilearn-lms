import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function useAuth() {
  const {
    login,
    clear,
    identity,
    isLoginSuccess,
    isInitializing,
    isLoggingIn,
  } = useInternetIdentity();

  return {
    login,
    logout: clear,
    isAuthenticated:
      isLoginSuccess || (!!identity && !identity.getPrincipal().isAnonymous()),
    isLoading: isInitializing || isLoggingIn,
    principal: identity?.getPrincipal().toString() ?? null,
    identity,
  };
}
