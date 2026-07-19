import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const editorActions = [
  "Ganti foto",
  "Ubah jadwal dan venue",
  "Periksa pratinjau",
  "Publikasikan",
] as const;

export function ProductExperience() {
  return (
    <section className="bg-landing-pearl py-24 sm:py-32">
      <div className="landing-container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Card className="rounded-[2rem] border-landing-ink/10 bg-landing-paper p-2 shadow-none ring-1 ring-landing-ink/10">
          <div className="grid min-h-[24rem] rounded-[1.55rem] bg-landing-ink p-6 text-landing-paper sm:p-8">
            <div className="self-start">
              <p className="text-sm uppercase text-landing-paper/55">
                Editor undangan
              </p>
              <p className="mt-4 max-w-xl font-landing-display text-4xl font-semibold leading-tight">
                Konten awal disiapkan admin, kontrol akhir tetap di tangan kalian.
              </p>
            </div>
            <div className="self-end border-t border-landing-paper/15 pt-6 text-sm leading-6 text-landing-paper/65">
              Akses editor membutuhkan akun aktif. Screenshot produksi akan
              dicapture setelah sesi admin/user tersedia, supaya tidak
              mengganti produk nyata dengan mockup palsu.
            </div>
          </div>
          <CardHeader className="px-4">
            <CardTitle className="font-landing-display text-2xl text-landing-ink">
              Editor mandiri setelah akun aktif
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 text-landing-ink/65">
            Alur editor ditampilkan sebagai tindakan nyata yang bisa dilakukan
            setelah akun diterima.
          </CardContent>
        </Card>
        <div>
          <h2 className="font-landing-display text-4xl font-semibold leading-tight text-landing-ink sm:text-5xl">
            Self service, tapi tidak terasa ditinggal sendiri.
          </h2>
          <ol className="mt-10 grid gap-4">
            {editorActions.map((action, index) => (
              <li
                key={action}
                className="grid grid-cols-[3rem_1fr] items-start gap-4 border-t border-landing-ink/12 pt-5"
              >
                <span className="font-landing-display text-2xl text-landing-rose">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-lg text-landing-ink">{action}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
