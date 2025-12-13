"use client";

import { createContext, useContext, useState } from "react";

interface OrgContextType {
  orgSlug: string;
  setOrgSlug: (slug: string) => void;
}

const OrgContext = createContext<OrgContextType | null>(null);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [orgSlug, setOrgSlug] = useState("acme");

  return (
    <OrgContext.Provider value={{ orgSlug, setOrgSlug }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const ctx = useContext(OrgContext);
  if (!ctx) {
    throw new Error("useOrg must be used inside OrgProvider");
  }
  return ctx;
}
