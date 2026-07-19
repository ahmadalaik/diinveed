import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showcaseTemplates } from "../config/landing-content";

export function TemplateShowcase() {
  return (
    <section id="template" className="bg-landing-paper py-24 sm:py-32">
      <div className="landing-container">
        <div className="max-w-3xl">
          <h2 className="font-landing-display text-4xl font-semibold leading-tight text-landing-ink sm:text-5xl">
            Pilih rasa visual yang sudah matang, lalu isi dengan cerita kalian.
          </h2>
          <p className="mt-5 text-lg leading-8 text-landing-ink/65">
            Showcase ini hanya menampilkan template yang layak dipasarkan. Dua
            template yang belum matang tidak kami jadikan janji di landing page.
          </p>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {showcaseTemplates.map((template, index) => (
            <Card
              key={template.slug}
              className={[
                "rounded-[2rem] border-landing-ink/10 bg-white/55 p-2 shadow-none ring-1 ring-landing-ink/10",
                index === 0 ? "lg:col-span-7 lg:row-span-2" : "",
                index === 1 || index === 2 ? "lg:col-span-5" : "",
                index === 3 ? "lg:col-span-12" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "overflow-hidden rounded-[1.55rem] bg-landing-pearl",
                  index === 0 ? "aspect-[4/5] lg:aspect-[16/13]" : "",
                  index === 3 ? "aspect-[16/8]" : "aspect-[4/3]",
                ].join(" ")}
              >
                <Image
                  src={template.image}
                  alt={template.alt}
                  width={1200}
                  height={900}
                  sizes={
                    index === 0
                      ? "(max-width: 1024px) 100vw, 54vw"
                      : "(max-width: 1024px) 100vw, 42vw"
                  }
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="px-4 pt-5">
                <CardDescription className="text-landing-rose">
                  {template.mood}
                </CardDescription>
                <CardTitle className="font-landing-display text-2xl text-landing-ink">
                  {template.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <p className="max-w-xl leading-7 text-landing-ink/65">
                  {template.description}
                </p>
              </CardContent>
              <CardFooter className="px-4 pb-4">
                <Button
                  asChild
                  variant="outline"
                  className="landing-focus rounded-full border-landing-ink/15 bg-transparent text-landing-ink hover:bg-landing-ink hover:text-landing-paper"
                >
                  <Link href={template.href}>
                    Lihat {template.name}
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
