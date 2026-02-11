import { FiltersBar } from "@/components/home/filters-bar";
import { FormCard } from "@/components/home/form-card";
import { mockFormCards } from "@/lib/mocks/forms";

export default function Home() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <FiltersBar />

      <section className="grid min-h-0 flex-1 auto-rows-max content-start grid-cols-1 gap-x-4 gap-y-4 overflow-y-auto pr-1 lg:grid-cols-3">
        {mockFormCards.map((form) => (
          <FormCard key={form.id} form={form} />
        ))}
      </section>
    </div>
  );
}
