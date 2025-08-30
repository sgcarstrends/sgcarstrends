import { Chip } from "@heroui/chip";
import type { Make } from "@web/types";
import { MakeCard } from "./make-card";

interface PopularMakesSectionProps {
  makes: Make[];
  onMakePress?: (make: Make) => void;
}

export const PopularMakesSection = ({
  makes,
  onMakePress,
}: PopularMakesSectionProps) => {
  if (makes.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-xl">Popular Makes</h2>
        <Chip size="sm" variant="shadow" color="primary">
          {makes.length}
        </Chip>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {makes.map((make) => (
          <MakeCard
            key={make}
            make={make}
            isPopular={true}
            onMakePress={onMakePress}
          />
        ))}
      </div>
    </section>
  );
};
