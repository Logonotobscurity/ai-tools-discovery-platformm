"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import { type ToolStore, createToolStore } from "@/stores/tool-store";

export const ToolStoreContext = createContext<StoreApi<ToolStore> | null>(null);

export interface ToolStoreProviderProps {
  children: ReactNode;
}

export const ToolStoreProvider = ({
  children,
}: ToolStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ToolStore>>();
  if (!storeRef.current) {
    storeRef.current = createToolStore();
  }

  return (
    <ToolStoreContext.Provider value={storeRef.current}>
      {children}
    </ToolStoreContext.Provider>
  );
};

export const useToolStore = <T,>(
  selector: (store: ToolStore) => T,
): T => {
  const toolStoreContext = useContext(ToolStoreContext);

  if (!toolStoreContext) {
    throw new Error(`useToolStore must be used within ToolStoreProvider`);
  }

  return useStore(toolStoreContext, selector);
};
