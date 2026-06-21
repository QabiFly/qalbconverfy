import { apiGet, apiPost, apiDelete } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";

export interface RoleRecord {
  id: string;
  slug: string;
  name: string;
  description ? : string;
}

export interface PermissionRecord {
  id: string;
  slug: string;
  description ? : string;
}

/** Admin-only — backend enforces RBAC checks on every call here. */
export const rbacService = {
  listRoles(): Promise < { results: RoleRecord[] } > {
    return apiGet(ENDPOINTS.rolesList());
  },
  createRole(slug: string, name: string, description = ""): Promise < RoleRecord > {
    return apiPost < RoleRecord > (ENDPOINTS.rolesList(), { slug, name, description });
  },
  listPermissions(): Promise < { results: PermissionRecord[] } > {
    return apiGet(ENDPOINTS.permissionsList());
  },
  createPermission(slug: string, description = ""): Promise < PermissionRecord > {
    return apiPost < PermissionRecord > (ENDPOINTS.permissionsList(), { slug, description });
  },
  grantPermissionToRole(roleSlug: string, permissionSlug: string): Promise < void > {
    return apiPost(ENDPOINTS.roleGrantPermission(roleSlug), { permission_slug: permissionSlug });
  },
  listUserRoles(userId: string): Promise < { results: RoleRecord[] } > {
    return apiGet(ENDPOINTS.userRoles(userId));
  },
  assignRoleToUser(userId: string, roleSlug: string): Promise < void > {
    return apiPost(ENDPOINTS.userRoles(userId), { role_slug: roleSlug });
  },
  revokeRoleFromUser(userId: string, roleSlug: string): Promise < void > {
    return apiDelete(ENDPOINTS.userRoleRevoke(userId, roleSlug));
  },
};