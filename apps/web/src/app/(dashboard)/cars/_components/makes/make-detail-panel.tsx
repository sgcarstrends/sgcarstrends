import { Card, CardBody } from "@heroui/card";
import type { CarLogo } from "@logos/types";
import type { SelectCar } from "@sgcarstrends/database";
import type { MakeCoeComparisonData } from "@web/queries/cars/makes/coe-comparison";
import { MakeDetail } from "./make-detail";
import { MakePreviewPlaceholder } from "./make-preview-placeholder";

interface SelectedMakeData {
  make: string;
  cars: { make: string; total: number; data: Partial<SelectCar>[] };
  logo?: CarLogo | null;
  coeComparison: MakeCoeComparisonData[];
}

interface MakeDetailPanelProps {
  selectedMakeData?: SelectedMakeData | null;
}

export function MakeDetailPanel({ selectedMakeData }: MakeDetailPanelProps) {
  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-8rem)] lg:block">
      <Card className="h-full overflow-hidden rounded-2xl shadow-sm">
        <CardBody className="h-full overflow-y-auto p-0">
          {selectedMakeData ? (
            <MakeDetail
              cars={selectedMakeData.cars}
              coeComparison={selectedMakeData.coeComparison}
              logo={selectedMakeData.logo}
            />
          ) : (
            <MakePreviewPlaceholder />
          )}
        </CardBody>
      </Card>
    </aside>
  );
}
