export const AUDIT_ACTIONS = {
  "auth.login": "Login berhasil",
  "auth.logout": "Logout",
  "auth.login_failed": "Login gagal",
  "user.created": "Membuat pengguna",
  "user.updated": "Mengubah pengguna",
  "user.deleted": "Menghapus pengguna",
  "user.role_updated": "Mengubah role",
  "transaction.created": "Membuat transaksi",
  "template.created": "Membuat template",
  "template.updated": "Mengubah template",
  "template.deleted": "Menghapus template",
  "invitation.created": "Membuat undangan",
  "invitation.saved": "Menyimpan undangan",
  "invitation.published": "Mempublikasikan undangan",
  "invitation.wishes_options_updated": "Mengubah opsi ucapan",
  "wish.moderated": "Memoderasi ucapan",
  "wish.deleted": "Menghapus ucapan",
  "rsvp.submitted": "Mengirim RSVP",
  "guest.created": "Menambah tamu",
  "guest.updated": "Mengubah tamu",
  "guest.deleted": "Menghapus tamu",
  "guest.marked_sent": "Menandai tamu terkirim",
  "guest_template.created": "Membuat template pesan",
  "guest_template.updated": "Mengubah template pesan",
  "guest_template.deleted": "Menghapus template pesan",
} as const;

export type AuditAction = keyof typeof AUDIT_ACTIONS;

export function auditActionDomain(action: string): string {
  return action.split(".")[0] ?? "other";
}
