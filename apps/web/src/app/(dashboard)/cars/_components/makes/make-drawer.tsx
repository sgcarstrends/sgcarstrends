"use client";

import { Drawer, DrawerContent, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

export const MakeDrawer = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <Drawer
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => router.back()}
      placement="right"
      size="4xl"
      isDismissable={true}
      isKeyboardDismissDisabled={true}
    >
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  );
};
