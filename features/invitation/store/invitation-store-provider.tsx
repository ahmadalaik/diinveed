"use client";

import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { useStore } from "zustand";
import type { EditorInitialData } from "../types/invitation.type";
import {
  createInvitationStore,
  type InvitationStore,
  type InvitationStoreApi,
} from "./invitation-store-core";

const InvitationStoreContext = createContext<InvitationStoreApi | null>(null);

type InvitationStoreProviderProps = PropsWithChildren<
  | { initialData: EditorInitialData; store?: never }
  | { store: InvitationStoreApi; initialData?: never }
>;

function createStoreFromInitialData(initialData: EditorInitialData) {
  const { updatedAt, ...state } = initialData;
  return createInvitationStore({
    ...state,
    saveStatus: "saved",
    lastSaved: updatedAt,
  });
}

export function InvitationStoreProvider(props: InvitationStoreProviderProps) {
  const [storeApi] = useState(() =>
    props.store ? props.store : createStoreFromInitialData(props.initialData),
  );

  return (
    <InvitationStoreContext.Provider value={storeApi}>
      {props.children}
    </InvitationStoreContext.Provider>
  );
}

export function useInvitationStoreApi() {
  const store = useContext(InvitationStoreContext);
  if (!store) throw new Error("InvitationStoreProvider is missing");
  return store;
}

export function useInvitationStore<T>(selector: (state: InvitationStore) => T) {
  return useStore(useInvitationStoreApi(), selector);
}
