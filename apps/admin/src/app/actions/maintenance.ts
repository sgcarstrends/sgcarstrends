"use server";

import { redis } from "@sgcarstrends/utils";

interface AppConfig {
  maintenance: {
    enabled: boolean;
    message: string;
  };
}

export interface MaintenanceConfig {
  enabled: boolean;
  message: string;
}

export const getMaintenanceConfig = async (): Promise<MaintenanceConfig> => {
  try {
    const config = await redis.get<AppConfig>("config");

    return (
      config?.maintenance ?? {
        enabled: false,
        message: "",
      }
    );
  } catch (error) {
    console.error("Error fetching maintenance config from Redis:", error);

    return {
      enabled: false,
      message: "",
    };
  }
};

export const updateMaintenanceConfig = async (
  maintenanceConfig: MaintenanceConfig,
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get current config
    const currentConfig =
      (await redis.get<AppConfig>("config")) ??
      ({
        maintenance: {
          enabled: false,
          message: "",
        },
      } satisfies AppConfig);

    // Update only maintenance section
    currentConfig.maintenance = maintenanceConfig;

    // Save back to Redis
    await redis.set("config", currentConfig);

    return { success: true };
  } catch (error) {
    console.error("Error updating maintenance config:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
