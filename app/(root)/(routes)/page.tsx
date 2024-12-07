"use client";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]); // We can't close this modal if we open it in the root, but we can do that, if opened from navbar

  return null; // Set up skeleton in the back-ground for styling
};

export default SetupPage;
