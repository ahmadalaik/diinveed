import { TemplateProps } from "../types";
import BannerTerracotta from "./banner-terracotta";
import { CoupleTerracotta } from "./couple-terracotta";
import { EventsTerracotta } from "./events-terracotta";
import TerracottaLayout from "./layout/terracotta-layout";
import { PrologTerracotta } from "./prolog-terracotta";
import { QuoteTerracotta } from "./quote-terracotta";

export default function TerracottaTemplate({ invitation }: TemplateProps) {
  return (
    <>
      <div className="relative w-full h-svh overflow-hidden font-serif">
        <div className="hidden lg:block fixed left-0 top-0 w-[70%] h-svh">
          <BannerTerracotta inv={invitation} />
        </div>

        <TerracottaLayout>
          <PrologTerracotta inv={invitation} />
          <QuoteTerracotta inv={invitation} />
          <CoupleTerracotta inv={invitation} />
          <EventsTerracotta inv={invitation} />
          
        </TerracottaLayout>
      </div>
    </>
  );
}
