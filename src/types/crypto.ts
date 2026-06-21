/**
 * Defensive types for the E2EE foundation endpoints. The backend
 * never returns plaintext — only opaque base64 ciphertext/key
 * strings. Fields are optional where the exact shape is uncertain.
 */

export interface DeviceIdentityKeyRecord {
  id: string;
  device_id: string;
  device_label ? : string;
  public_key: string;
  algorithm_version: string;
  status: "active" | "revoked";
  registered_at ? : string;
  revoked_at ? : string | null;
}

export interface SignedPreKeyRecord {
  id: string;
  key_id: number;
  public_key: string;
  signature: string;
  algorithm_version: string;
  is_current ? : boolean;
  created_at ? : string;
}

export interface KeyBundleDevice {
  device_id: string;
  device_identity_public_key: string;
  algorithm_version: string;
  signed_prekey: {
    key_id: number;
    public_key: string;
    signature: string;
  };
  one_time_prekey: { key_id: number;public_key: string } | null;
}

export interface KeyBundle {
  user_id: string;
  username: string;
  identity_public_key: string;
  identity_algorithm_version: string;
  devices: KeyBundleDevice[];
}

export interface EncryptedMessageRecord {
  id: string;
  conversation ? : string;
  sender: { id: string;username: string;avatar_url: string | null } | null;
  sender_device_id: string;
  recipient_device_id: string;
  message_type: string;
  ciphertext: string;
  nonce: string;
  algorithm_version: string;
  key_version: number;
  reply_to_id ? : string | null;
  is_forwarded ? : boolean;
  expires_at ? : string | null;
  delivery_status: "sent" | "delivered" | "read";
  delivered_at ? : string | null;
  read_at ? : string | null;
  edited_at ? : string | null;
  created_at ? : string;
}