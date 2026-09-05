/**
 * Shared crypto utilities for shareable configuration links.
 *
 * Encryption scheme: AES-GCM-256
 *   Key  = SHA-256(headerValue)
 *   IV   = SHA-256(plaintext bytes + headerValue bytes)[0..11]   ← deterministic
 *
 * The IV is deterministic so two users with identical inputs produce the
 * same ciphertext and therefore the same shareable URL.
 *
 * The headerValue is used as the decryption password and is never embedded
 * in the URL — the recipient supplies it themselves.
 *
 * Wire format: base64url( 12-byte IV | ciphertext )
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

async function importKey(
  headerValue: string,
  usage: "encrypt" | "decrypt",
): Promise<CryptoKey> {
  const keyBytes = await crypto.subtle.digest(
    "SHA-256",
    enc.encode(headerValue),
  );
  return crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM" },
    false,
    [usage],
  );
}

export async function encryptState(
  payload: Record<string, string>,
  headerValue: string,
): Promise<string> {
  const plaintext = enc.encode(JSON.stringify(payload));
  const key = await importKey(headerValue, "encrypt");

  // Deterministic IV = first 12 bytes of SHA-256(plaintext + headerValue)
  const ivSource = new Uint8Array([
    ...plaintext,
    ...enc.encode(headerValue),
  ]);
  const ivHash = await crypto.subtle.digest("SHA-256", ivSource);
  const iv = new Uint8Array(ivHash, 0, 12);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext,
  );

  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);

  // Base64url-encode (no padding)
  return btoa(String.fromCharCode(...combined))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Decrypts a base64url state string using the supplied headerValue.
 * Returns the parsed payload, or throws if the key is wrong or data is corrupt.
 */
export async function decryptState(
  encoded: string,
  headerValue: string,
): Promise<Record<string, string>> {
  // Re-pad base64url → base64
  const base64 = encoded
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(encoded.length + ((4 - (encoded.length % 4)) % 4), "=");

  const combined = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const key = await importKey(headerValue, "decrypt");

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );

  return JSON.parse(dec.decode(plaintext)) as Record<string, string>;
}
