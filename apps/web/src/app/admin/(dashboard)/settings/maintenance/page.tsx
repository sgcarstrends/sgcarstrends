"use client";

import { Badge } from "@sgcarstrends/ui/components/badge";
import { Button } from "@sgcarstrends/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sgcarstrends/ui/components/card";
import { Input } from "@sgcarstrends/ui/components/input";
import { Label } from "@sgcarstrends/ui/components/label";
import { Separator } from "@sgcarstrends/ui/components/separator";
import { Switch } from "@sgcarstrends/ui/components/switch";
import {
  getMaintenanceConfig,
  updateMaintenanceConfig,
} from "@web/app/admin/_actions/maintenance";
import {
  AlertCircle,
  ArrowLeft,
  Globe,
  Loader2,
  Save,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

const MaintenancePage = () => {
  const [isMaintenanceEnabled, setIsMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "We're currently performing scheduled maintenance. Please check back soon!",
  );
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);

  // Load initial maintenance config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getMaintenanceConfig();
        startTransition(() => {
          setIsMaintenanceEnabled(config.enabled);
          setMaintenanceMessage(
            config.message ||
              "We're currently performing scheduled maintenance. Please check back soon!",
          );
        });
      } catch (error) {
        console.error("Failed to load maintenance config:", error);
        toast.error("Failed to load maintenance configuration.");
      }
    };

    loadConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateMaintenanceConfig({
        enabled: isMaintenanceEnabled,
        message: maintenanceMessage,
      });

      if (result.success) {
        toast.success("Maintenance settings updated successfully!");
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Failed to save maintenance settings:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save maintenance settings.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = () => {
    if (!isMaintenanceEnabled) return true;
    return maintenanceMessage.trim();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/settings"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Settings
        </Link>
      </div>

      <div>
        <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
          <Wrench className="size-8" />
          Maintenance Mode
          {isPending && (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          )}
        </h1>
        <p className="text-muted-foreground">
          Configure maintenance mode settings to temporarily disable services
          during updates and repairs.
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Status
            <Badge variant={isMaintenanceEnabled ? "destructive" : "default"}>
              {isMaintenanceEnabled ? "Under Maintenance" : "Normal Operation"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Current maintenance status for the web application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border p-6">
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Globe className="size-6" />
              </div>
              <div className="font-medium text-lg">Web Application</div>
              <Badge
                variant="outline"
                className={
                  isMaintenanceEnabled
                    ? "mt-2 bg-orange-50 text-orange-700"
                    : "mt-2 bg-green-50 text-green-700"
                }
              >
                {isMaintenanceEnabled
                  ? "Maintenance Mode"
                  : "Online & Operational"}
              </Badge>
            </div>
          </div>
          {isMaintenanceEnabled && maintenanceMessage && (
            <div className="mt-4 rounded-md border border-orange-200 bg-orange-50 p-3">
              <p className="text-orange-800 text-sm">
                <strong>Active Message:</strong> {maintenanceMessage}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Maintenance Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Configuration</CardTitle>
          <CardDescription>
            Configure when and how maintenance mode will be activated
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="maintenance-toggle"
                className="font-medium text-base"
              >
                Enable Maintenance Mode
              </Label>
              <p className="text-muted-foreground text-sm">
                Activate maintenance mode for selected services
              </p>
            </div>
            <Switch
              id="maintenance-toggle"
              checked={isMaintenanceEnabled}
              onCheckedChange={setIsMaintenanceEnabled}
            />
          </div>

          {isMaintenanceEnabled && (
            <>
              {/* Maintenance Message */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="maintenance-message">Maintenance Message</Label>
                <Input
                  id="maintenance-message"
                  placeholder="Enter the message users will see during maintenance..."
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  className="text-base"
                />
                <p className="text-muted-foreground text-sm">
                  This message will be displayed to users when they try to
                  access services under maintenance.
                </p>
              </div>

              {/* Service Scope Info */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Globe className="size-4" />
                  <Label className="font-medium text-base">Service Scope</Label>
                </div>
                <p className="text-muted-foreground text-sm">
                  Maintenance mode affects the web application only
                  (sgcarstrends.com). The API (api.sgcarstrends.com) remains
                  operational.
                </p>
              </div>

              {/* Preview */}
              {maintenanceMessage.trim() && (
                <div className="flex flex-col gap-2">
                  <Label>Preview</Label>
                  <div className="rounded-md border border-orange-200 bg-orange-50 p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-orange-800">
                      <Wrench className="size-5" />
                      <strong>Site Under Maintenance</strong>
                    </div>
                    <p className="mt-2 text-orange-700">{maintenanceMessage}</p>
                  </div>
                </div>
              )}

              {/* Validation Warnings */}
              {isMaintenanceEnabled && !maintenanceMessage.trim() && (
                <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
                  <AlertCircle className="size-4" />
                  <span className="text-sm">
                    Maintenance message is required when maintenance mode is
                    enabled.
                  </span>
                </div>
              )}
            </>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving || !isFormValid()}
              className="flex items-center gap-2"
            >
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions & Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-muted-foreground text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">⚠️</span>
            <span>
              <strong>Immediate Effect:</strong> Changes take effect within 30
              seconds via Edge Config synchronization.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">🌐</span>
            <span>
              <strong>Website Maintenance:</strong> Redirects all web pages to a
              maintenance page with your custom message.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">🔌</span>
            <span>
              <strong>API Status:</strong> The API remains operational during
              web maintenance mode for external clients.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">🔄</span>
            <span>
              <strong>Auto-Refresh:</strong> Users on the maintenance page are
              automatically redirected when maintenance mode is disabled.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;
