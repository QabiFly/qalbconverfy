export type ProfilePrivacy = "public" | "private";
export type VerificationLevel = "none" | "verified" | "official";

/** Minimal embedded user shape — used wherever a user appears nested
 * inside another resource (post owner, comment author, message sender). */
export interface UserMini {
  id: string;
  username: string;
  profile_slug ? : string;
  avatar_url: string | null;
  verification_level ? : VerificationLevel;
}

/** Full profile shape. Fields are optional defensively since the exact
 * response shape from PublicProfileView / MyProfileView is not
 * guaranteed without an OpenAPI contract. */
export interface UserProfile {
  id: string;
  username: string;
  email ? : string;
  profile_slug ? : string;
  bio ? : string;
  avatar_url: string | null;
  privacy ? : ProfilePrivacy;
  verification_level ? : VerificationLevel;
  follower_count ? : number;
  following_count ? : number;
  post_count ? : number;
  canonical_url ? : string;
  is_following ? : boolean;
  is_followed_by ? : boolean;
  has_pending_follow_request ? : boolean;
  is_self ? : boolean;
  created_at ? : string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
}

export interface LoginResponseData {
  user: UserProfile;
  access?: string;
  refresh?: string;
  tokens?: AuthTokens;
}

export interface RegisterResponseData {
  user: UserProfile;
  message ? : string;
}

export interface Device {
  id: string;
  device_label ? : string;
  last_seen_at ? : string;
  is_current ? : boolean;
  created_at ? : string;
}

export interface Session {
  id: string;
  device_label ? : string;
  ip_address ? : string;
  created_at ? : string;
  last_active_at ? : string;
  is_current ? : boolean;
}