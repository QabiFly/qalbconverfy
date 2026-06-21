"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/stores/toast-store";
import { tokenStorage } from "@/lib/api/token-storage";
import { extractErrorMessage } from "@/lib/api/client";
import { authService, userService } from "@/lib/api/services";
import { APP_ROUTES } from "@/constants/app-routes";
import { LoginPayload, RegisterPayload } from "@/types";

interface AuthContextValue {
  login: (payload: LoginPayload) => Promise < void > ;
  register: (payload: RegisterPayload) => Promise < void > ;
  logout: () => Promise < void > ;
}

const AuthContext = createContext < AuthContextValue | null > (null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrating = useAuthStore((s) => s.setHydrating);
  const storeLogout = useAuthStore((s) => s.logout);
  const hasBootstrapped = useRef(false);
  
  useEffect(() => {
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;
    
    async function bootstrap() {
      if (!tokenStorage.hasTokens()) {
        setHydrating(false);
        return;
      }
      
      try {
        const profile = await userService.getMyProfile();
        setUser(profile);
      } catch {
        tokenStorage.clearTokens();
        setUser(null);
      } finally {
        setHydrating(false);
      }
    }
    
    bootstrap();
  }, [setUser, setHydrating]);
  
  const login = useCallback(
    async (payload: LoginPayload) => {
        try {
          const { user, tokens } = await authService.login(payload);
          tokenStorage.setTokens(tokens.access, tokens.refresh);
          setUser(user);
          toast.success(`Welcome back, ${user.username}.`);
          router.push(APP_ROUTES.home);
        } catch (error) {
          toast.error("Login failed", extractErrorMessage(error));
          throw error;
        }
      },
      [setUser, router]
  );
  
  const register = useCallback(
    async (payload: RegisterPayload) => {
        try {
          await authService.register(payload);
          toast.success("Account created", "Please sign in with your new credentials.");
          router.push(APP_ROUTES.login);
        } catch (error) {
          toast.error("Registration failed", extractErrorMessage(error));
          throw error;
        }
      },
      [router]
  );
  
  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Local state still clears even if the server call fails.
    } finally {
      storeLogout();
      toast.info("Signed out");
      router.push(APP_ROUTES.landing);
    }
  }, [storeLogout, router]);
  
  return (
    <AuthContext.Provider value={{ login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}