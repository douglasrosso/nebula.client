"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function StoreHydration() {
  useEffect(() => {
    useStore.persist.rehydrate();
    useStore.getState().loadCurrentUser();
  }, []);

  return null;
}
