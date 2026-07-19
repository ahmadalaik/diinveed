import { landingContent } from "../config/landing-content";

export function OrderFlow() {
  return (
    <section id="cara-pesan" className="bg-landing-pearl py-24 sm:py-32">
      <div className="landing-container">
        <div className="max-w-3xl">
          <h2 className="font-landing-display text-4xl font-semibold leading-tight text-landing-ink sm:text-5xl">
            Alurnya sengaja transparan karena pembayaran masih manual.
          </h2>
          <p className="mt-5 text-lg leading-8 text-landing-ink/65">
            User bayar manual, admin konfirmasi dan mengirim akun, lalu user
            melanjutkan self service dari editor.
          </p>
        </div>
        <ol className="mt-14 grid gap-4 md:grid-cols-5">
          {landingContent.orderSteps.map((step, index) => (
            <li
              key={step}
              className="min-h-48 border-t border-landing-ink/15 pt-5"
            >
              <span className="font-landing-display text-4xl text-landing-rose">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-6 pr-4 leading-7 text-landing-ink">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
