import type {
  EventItem,
  StoryItem,
} from "@/features/invitation/types/invitation.type";

const MS_PER_DAY = 86_400_000;

/**
 * Tanggal disimpan sebagai string `YYYY-MM-DD` (konvensi repo, lihat
 * `rsvpDeadline`). Yang dihitung template ini adalah **selisih hari kalender**,
 * bukan selisih instan waktu — "sudah bersama 2.847 hari" harus cocok dengan
 * kalender yang dilihat pengantin, di zona waktu mana pun mereka berada.
 *
 * Karena itu string diurai sebagai tanggal kalender murni (tanpa menyentuh
 * `new Date(string)`, yang memperlakukan bentuk date-only sebagai UTC dan
 * bentuk ber-jam sebagai lokal — sumber bug off-by-one), sedangkan `now`
 * dibaca lewat getter LOKAL karena itulah kalender penggunanya.
 *
 * Keduanya lalu dipetakan ke nomor hari via `Date.UTC`, yang di sini hanya
 * dipakai sebagai aritmetika kalender bebas zona waktu — bukan konversi.
 */
type CalendarDate = { year: number; month: number; day: number };

function parseCalendarDate(value: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  // Tolak tanggal yang tidak ada, mis. 2026-02-31.
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function toDayNumber({ year, month, day }: CalendarDate): number {
  return Date.UTC(year, month - 1, day) / MS_PER_DAY;
}

/** Nomor hari kalender LOKAL dari `now` — kalender yang dilihat pengguna. */
function todayNumber(now: Date): number {
  return toDayNumber({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
}

/** Jumlah hari penuh sejak `startDate`. Null kalau kosong, tak valid, atau di masa depan. */
export function daysTogether(startDate: string, now: Date): number | null {
  const start = parseCalendarDate(startDate);
  if (!start) return null;

  const diff = todayNumber(now) - toDayNumber(start);
  return diff < 0 ? null : diff;
}

/** Hari menuju acara mendatang paling awal. Null kalau tidak ada acara mendatang. */
export function daysUntilFirstEvent(
  events: EventItem[],
  now: Date,
): number | null {
  const today = todayNumber(now);

  const upcoming = events
    .map((event) => parseCalendarDate(event.date))
    .filter((date): date is CalendarDate => date !== null)
    .map(toDayNumber)
    .filter((dayNumber) => dayNumber >= today)
    .sort((a, b) => a - b);

  if (upcoming.length === 0) return null;
  return upcoming[0] - today;
}

/**
 * `story.year` disimpan editor sebagai tanggal `YYYY-MM-DD` (lihat
 * `story-field.tsx`, kontrolnya `DatePicker` berlabel "Tanggal"). Untuk
 * eyebrow kita hanya butuh tahunnya. Regex ini juga menerima bentuk lawas
 * "2019" (empat digit polos), jadi kedua bentuk tetap didukung.
 */
function storyYear(value: string): string | null {
  const match = /^(\d{4})/.exec(value.trim());
  return match ? match[1] : null;
}

/** Rentang tahun tertua–termuda dari linimasa cerita. Null kalau tak ada tahun terisi. */
export function storyYearSpan(
  items: StoryItem[],
): { from: string; to: string } | null {
  const years = items
    .map((item) => storyYear(item.year))
    .filter((year): year is string => year !== null)
    .sort();

  if (years.length === 0) return null;
  return { from: years[0], to: years[years.length - 1] };
}
