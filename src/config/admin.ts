// The Abyssal Overseer — only this Google account can reach the admin space.
// Compared case-insensitively against the signed-in Firebase user's email.
export const OWNER_EMAILS = ["daoudahakim65@gmail.com"];

export function isOwner(email: string | null | undefined): boolean {
  if (!email) return false;
  return OWNER_EMAILS.some((e) => e.toLowerCase() === email.toLowerCase());
}
