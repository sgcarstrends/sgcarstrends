"use client";

import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Home, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

const NoData = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Alert
        color="danger"
        title="No Data Available"
        description="The requested page does not exist or no data is available."
      />
      <div className="flex items-center gap-2">
        <Button
          variant="bordered"
          onPress={() => router.push("/")}
          startContent={<Home className="size-4" />}
        >
          Go Home
        </Button>
        <Button
          variant="bordered"
          onPress={() => router.back()}
          startContent={<RotateCcw className="size-4" />}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NoData;
