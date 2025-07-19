"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, Home, RotateCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const NoData = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          The requested page does not exist or no data is available.
        </AlertDescription>
      </Alert>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => router.push("/")}>
          <Home className="mr-2 size-4" />
          Go Home
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          <RotateCcw className="mr-2 size-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NoData;
