import { getMaintenanceStatus } from "@web/actions/maintenance";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useMaintenance = (pollingInterval = 30000) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const { enabled } = await getMaintenanceStatus();
        setIsMaintenanceMode(enabled);

        if (!enabled) {
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

    const interval = setInterval(checkMaintenance, pollingInterval);

    void checkMaintenance();

    return () => clearInterval(interval);
  }, [pollingInterval, router, searchParams]);
};

export default useMaintenance;
