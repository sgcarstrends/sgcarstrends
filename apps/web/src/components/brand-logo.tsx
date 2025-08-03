import { TrendingUp } from "lucide-react";
import { APP_ENV } from "@web/config";
import { AppEnv } from "@web/types";

export const BrandLogo = () => (
  <div className="flex items-center gap-2">
    <TrendingUp className="size-6 text-blue-600 lg:size-8" />
    <div className="flex items-center gap-2">
      <span className="font-bold lg:text-xl">
        <span className="text-black">SGCars</span>
        <span className="text-blue-600">Trends</span>
      </span>
      {APP_ENV === AppEnv.DEV && (
        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
          Dev
        </span>
      )}
      {APP_ENV === AppEnv.STAGING && (
        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
          Staging
        </span>
      )}
    </div>
  </div>
);
