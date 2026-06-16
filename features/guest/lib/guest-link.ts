/** Build a guest's personal invitation URL: {base}/invitation/{slug}?to={guestSlug}. */
export function buildGuestInvitationUrl(
  baseUrl: string,
  invitationSlug: string,
  guestSlug: string,
): string {
  const base = baseUrl.replace(/\/+$/, "");
  return `${base}/invitation/${invitationSlug}?to=${guestSlug}`;
}
