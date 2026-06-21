import { apiPost } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";
import {
  LoginPayload,
  LoginResponseData,
  RegisterPayload,
  RegisterResponseData,
  AuthTokens,
} from "@/types";

export const authService = {
  login(payload: LoginPayload): Promise<LoginResponseData> {
    return apiPost<LoginResponseData, LoginPayload>(ENDPOINTS.login(), payload);
  },

  register(payload: RegisterPayload): Promise<RegisterResponseData> {
    return apiPost<RegisterResponseData, RegisterPayload>(ENDPOINTS.register(), payload);
  },

  refresh(refreshToken: string): Promise<AuthTokens> {
    return apiPost<AuthTokens, { refresh: string }>(ENDPOINTS.refresh(), {
      refresh: refreshToken,
    });
  },

  logout(refreshToken: string): Promise<void> {
    return apiPost<void, { refresh: string }>(ENDPOINTS.logout(), {
      refresh: refreshToken,
    });
  },

  logoutAll(): Promise<void> {
    return apiPost<void>(ENDPOINTS.logoutAll());
  },

  passwordChange(payload: { current_password: string; new_password: string }): Promise<void> {
    return apiPost(ENDPOINTS.passwordChange(), payload);
  },

  passwordResetRequest(payload: { email: string }): Promise<void> {
    return apiPost(ENDPOINTS.passwordResetRequest(), payload);
  },

  passwordResetConfirm(payload: { token: string; new_password: string }): Promise<void> {
    return apiPost(ENDPOINTS.passwordResetConfirm(), payload);
  },
};