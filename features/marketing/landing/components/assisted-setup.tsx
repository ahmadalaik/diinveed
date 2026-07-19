import { Separator } from "@/components/ui/separator";

export function AssistedSetup() {
  return (
    <section className="bg-landing-paper py-20 sm:py-28">
      <div className="landing-container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <h2 className="font-landing-display text-4xl font-semibold leading-tight text-landing-ink sm:text-5xl">
            Tidak harus mulai dari layar kosong.
          </h2>
        </div>
        <div className="text-lg leading-8 text-landing-ink/70">
          <p>
            Admin dapat membantu pengisian konten awal dari materi yang kalian
            kirimkan: nama, foto, cerita, jadwal, lokasi, rekening hadiah, dan
            preferensi template.
          </p>
          <Separator className="my-8 bg-landing-ink/12" />
          <p>
            Setelah akun dikirim, kalian tetap dapat mengedit sendiri:
            memperbaiki teks, mengganti gambar, melihat tampilan akhir, lalu
            membagikan tautan saat sudah siap. Bantuan ini menjaga proses tetap
            personal, tanpa memperluasnya menjadi layanan desain dari nol,
            penulisan naskah lengkap, atau retouching foto.
          </p>
        </div>
      </div>
    </section>
  );
}
