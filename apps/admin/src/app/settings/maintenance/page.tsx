"use client";

import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@admin/components/ui/card";
import { Input } from "@admin/components/ui/input";
import { Label } from "@admin/components/ui/label";
import { Separator } from "@admin/components/ui/separator";
import { Switch } from "@admin/components/ui/switch";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Save,
  Server,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MaintenancePage = () => {
  const [isMaintenanceEnabled, setIsMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "We're currently performing scheduled maintenance. Please check back soon!",
  );
  const [isScheduled, setIsScheduled] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Mock current maintenance status - replace with actual API call
  const currentMaintenanceStatus = {
    isActive: false,
    message: null,
    scheduledStart: null,
    scheduledEnd: null,
    affectedServices: [],
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would make an API call to update maintenance settings
      // This might involve updating environment variables, database, or config files
      const maintenanceConfig = {
        enabled: isMaintenanceEnabled,
        message: maintenanceMessage,
        scheduled: isScheduled
          ? {
              start: startTime,
              end: endTime,
            }
          : null,
      };

      console.log("Saving maintenance configuration:", maintenanceConfig);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message (you could use a toast library)
      alert("Maintenance settings updated successfully!");
    } catch (error) {
      console.error("Failed to save maintenance settings:", error);
      alert("Failed to save maintenance settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = () => {
    if (!isMaintenanceEnabled) return true;
    if (!maintenanceMessage.trim()) return false;
    if (isScheduled && (!startTime || !endTime)) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/settings"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>
      </div>

      <div>
        <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
          <Wrench className="h-8 w-8" />
          Maintenance Mode
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
            <Badge variant={currentMaintenanceStatus.isActive ? "destructive" : "default"}>
              {currentMaintenanceStatus.isActive ? "Under Maintenance" : "Normal Operation"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Current maintenance status across all services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border p-6">
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Globe className="h-6 w-6" />
                <Server className="h-6 w-6" />  
              </div>
              <div className="font-medium text-lg">All Services</div>
              <Badge variant="outline" className="mt-2 bg-green-50 text-green-700">
                Online & Operational
              </Badge>
            </div>
          </div>
          {currentMaintenanceStatus.isActive && (
            <div className="mt-4 rounded-md border border-orange-200 bg-orange-50 p-3">
              <p className="text-orange-800 text-sm">
                <strong>Active Message:</strong> {currentMaintenanceStatus.message}
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
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance-toggle" className="font-medium text-base">
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
              <div className="space-y-2">
                <Label htmlFor="maintenance-message">Maintenance Message</Label>
                <Input
                  id="maintenance-message"
                  placeholder="Enter the message users will see during maintenance..."
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  className="text-base"
                />
                <p className="text-muted-foreground text-sm">
                  This message will be displayed to users when they try to access
                  services under maintenance.
                </p>
              </div>

              {/* Service Scope Info */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4" />
                  <Server className="h-4 w-4" />
                  <Label className="font-medium text-base">Service Scope</Label>
                </div>
                <p className="text-muted-foreground text-sm">
                  Maintenance mode will affect all services including the main website 
                  (sgcarstrends.com) and all API endpoints (api.sgcarstrends.com).
                </p>
              </div>

              {/* Scheduled Maintenance */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="scheduled-toggle" className="font-medium text-base">
                      Schedule Maintenance
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Set specific start and end times for maintenance
                    </p>
                  </div>
                  <Switch
                    id="scheduled-toggle"
                    checked={isScheduled}
                    onCheckedChange={setIsScheduled}
                  />
                </div>

                {isScheduled && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">
                        <Calendar className="mr-1 inline h-4 w-4" />
                        Start Time
                      </Label>
                      <Input
                        id="start-time"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">
                        <Clock className="mr-1 inline h-4 w-4" />
                        End Time
                      </Label>
                      <Input
                        id="end-time"
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Preview */}
              {maintenanceMessage.trim() && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="rounded-md border border-orange-200 bg-orange-50 p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-orange-800">
                      <Wrench className="h-5 w-5" />
                      <strong>Site Under Maintenance</strong>
                    </div>
                    <p className="mt-2 text-orange-700">{maintenanceMessage}</p>
                  </div>
                </div>
              )}

              {/* Validation Warnings */}
              {isMaintenanceEnabled && !maintenanceMessage.trim() && (
                <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Maintenance message is required when maintenance mode is enabled.
                  </span>
                </div>
              )}


              {isScheduled && startTime && endTime && new Date(startTime) >= new Date(endTime) && (
                <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    End time must be after start time.
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
              <Save className="h-4 w-4" />
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
        <CardContent className="space-y-3 text-muted-foreground text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">⚠️</span>
            <span>
              <strong>Immediate Effect:</strong> Changes take effect immediately
              unless scheduled for a future time.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">🌐</span>
            <span>
              <strong>Website Maintenance:</strong> Redirects all pages to a
              maintenance page with your custom message.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">🔌</span>
            <span>
              <strong>API Maintenance:</strong> All API endpoints return 503 Service 
              Unavailable responses with maintenance headers.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">⏰</span>
            <span>
              <strong>Scheduled Maintenance:</strong> Automatically activates and
              deactivates at the specified times.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">📧</span>
            <span>
              <strong>Notifications:</strong> Team members will be notified when
              maintenance mode is activated or scheduled.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;