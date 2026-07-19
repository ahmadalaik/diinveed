import { AccordionSection } from "./sections";

export function StudioEditor() {
  return (
    <aside className="w-full h-full flex flex-col md:w-110 md:shrink-0">
      <div className="double-bezel-outer h-full flex flex-col">
        <div className="double-bezel-inner h-full flex flex-col p-3.5 sm:p-5">
          <div className="flex-1 overflow-y-auto scrollbar-none pr-1">
            <AccordionSection />
          </div>
        </div>
      </div>
    </aside>
  );
}
