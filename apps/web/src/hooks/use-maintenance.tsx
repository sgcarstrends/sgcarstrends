import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const useMaintenance = (pollingInterval = 5000) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // TODO: Simulating this for now
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        if (!isMaintenanceMode) {
          const from = searchParams.get("from");
          if (from) {
            router.replace(decodeURIComponent(from));
          } else {
            router.replace("/");
          }
        }
      } catch (e) {
        console.error("Error checking maintenance status:", e);
      }
    };

    const interval = setInterval(() => isMaintenanceMode, pollingInterval);

    void checkMaintenance();

    return () => clearInterval(interval);
  }, [isMaintenanceMode, pollingInterval, router, searchParams]);
};

export default useMaintenance;
