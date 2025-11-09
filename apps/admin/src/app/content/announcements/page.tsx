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
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  MessageSquare,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Mock current announcement data - replace with actual API call
  const currentAnnouncement = null; // This would come from your API/config

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would make an API call to update the announcement
      // This might involve updating environment variables, database, or config files
      console.log("Saving announcement:", { isEnabled, announcementText });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message (you could use a toast library)
      alert("Announcement updated successfully!");
    } catch (error) {
      console.error("Failed to save announcement:", error);
      alert("Failed to save announcement. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEnabled = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/content"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Content Management
        </Link>
      </div>

      <div>
        <h1 className="flex items-center gap-2 font-bold text-3xl tracking-tight">
          <MessageSquare className="h-8 w-8" />
          Announcements
        </h1>
        <p className="text-muted-foreground">
          Manage site-wide announcements that appear at the top of the website.
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Status
            <Badge variant={currentAnnouncement ? "default" : "secondary"}>
              {currentAnnouncement ? "Active" : "No Announcement"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Current announcement displayed on the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentAnnouncement ? (
            <div className="rounded-md border bg-primary p-4 text-center text-primary-foreground">
              {currentAnnouncement}
            </div>
          ) : (
            <div className="rounded-md border bg-muted p-4 text-center text-muted-foreground">
              No announcement is currently active
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Announcement Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Announcement</CardTitle>
          <CardDescription>
            Create or modify the announcement that will be displayed to users
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <Label
              htmlFor="enable-announcement"
              className="font-medium text-base"
            >
              Enable Announcement
            </Label>
            <Button
              variant={isEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleEnabled}
              className="flex items-center gap-2"
            >
              {isEnabled ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              {isEnabled ? "Enabled" : "Disabled"}
            </Button>
          </div>

          {/* Announcement Text Input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="announcement-text">Announcement Text</Label>
            <Input
              id="announcement-text"
              placeholder="Enter your announcement message..."
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="text-base"
              disabled={!isEnabled}
            />
            <p className="text-muted-foreground text-sm">
              Keep it concise and clear. This will appear at the top of every
              page.
            </p>
          </div>

          {/* Preview */}
          {isEnabled && announcementText && (
            <div className="flex flex-col gap-2">
              <Label>Preview</Label>
              <div className="rounded-md border bg-primary p-4 text-center text-primary-foreground">
                {announcementText}
              </div>
            </div>
          )}

          {/* Warning */}
          {isEnabled && !announcementText.trim() && (
            <div className="flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 p-3 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                Announcement is enabled but no text is provided. Please add
                announcement text or disable it.
              </span>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving || (isEnabled && !announcementText.trim())}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-muted-foreground text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">1.</span>
            <span>
              Toggle the announcement on or off using the Enable/Disable button.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">2.</span>
            <span>Enter your announcement text in the input field.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">3.</span>
            <span>Preview how it will look on the website before saving.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">4.</span>
            <span>
              Click &quot;Save Changes&quot; to apply the announcement to the
              live website.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">Note:</span>
            <span>
              Changes may take a few minutes to appear on the website due to
              caching.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
