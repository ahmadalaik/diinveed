import { Checkerboard } from "../motifs/checkerboard";
import { MixtapeHeading } from "../motifs/heading";
import { MixtapePill } from "../motifs/pill";

type MixtapeBridgeProps = { onContinue: () => void };

export function MixtapeBridge({ onContinue }: MixtapeBridgeProps) {
  return (
    <section className="relative flex h-full flex-col justify-center px-6">
      <MixtapeHeading
        thin="Sisanya ada"
        bold="di bawah sini"
        className="text-3xl"
      />
      <p
        className="mt-3 max-w-[26ch] text-sm font-(family-name:--tpl-font-body)"
        style={{ opacity: 0.85 }}
      >
        Jadwal lengkap, lokasi, dan konfirmasi kehadiran.
      </p>
      <div className="relative z-50 mt-6">
        <MixtapePill as="button" onClick={onContinue}>
          Lihat semua detail
        </MixtapePill>
      </div>
      <Checkerboard className="bottom-0 left-0 h-[26%] w-full" />
    </section>
  );
}
