import React, { createContext, useContext, useState, useCallback } from "react";
import { Asset, Risk, initialAssets, initialRisks, getRiskLevel } from "@/data/mockData";
import { cisControls, CISControl, ControlStatus } from "@/data/cisControls";

interface GRCContextType {
  assets: Asset[];
  risks: Risk[];
  controls: CISControl[];
  addAsset: (asset: Omit<Asset, "id" | "lastUpdated">) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  addRisk: (risk: Omit<Risk, "id" | "level">) => void;
  updateRisk: (id: string, risk: Partial<Risk>) => void;
  deleteRisk: (id: string) => void;
  updateControlStatus: (safeguardId: string, status: ControlStatus) => void;
  getCompliancePercentage: () => number;
  getActiveRisksCount: () => number;
  getNonCompliantControls: () => { controlTitle: string; safeguardId: string; safeguardTitle: string }[];
}

const GRCContext = createContext<GRCContextType | undefined>(undefined);

export function GRCProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [risks, setRisks] = useState<Risk[]>(initialRisks);
  const [controlsState, setControls] = useState<CISControl[]>(cisControls);

  const addAsset = useCallback((asset: Omit<Asset, "id" | "lastUpdated">) => {
    setAssets(prev => [...prev, { ...asset, id: `a${Date.now()}`, lastUpdated: new Date().toISOString().split("T")[0] }]);
  }, []);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates, lastUpdated: new Date().toISOString().split("T")[0] } : a));
  }, []);

  const deleteAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    setRisks(prev => prev.filter(r => r.assetId !== id));
  }, []);

  const addRisk = useCallback((risk: Omit<Risk, "id" | "level">) => {
    const level = getRiskLevel(risk.likelihood, risk.impact);
    setRisks(prev => [...prev, { ...risk, id: `r${Date.now()}`, level }]);
  }, []);

  const updateRisk = useCallback((id: string, updates: Partial<Risk>) => {
    setRisks(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, ...updates };
      if (updates.likelihood || updates.impact) {
        updated.level = getRiskLevel(updated.likelihood, updated.impact);
      }
      return updated;
    }));
  }, []);

  const deleteRisk = useCallback((id: string) => {
    setRisks(prev => prev.filter(r => r.id !== id));
  }, []);

  const updateControlStatus = useCallback((safeguardId: string, status: ControlStatus) => {
    setControls(prev => prev.map(c => ({
      ...c,
      safeguards: c.safeguards.map(s => s.id === safeguardId ? { ...s, status } : s),
    })));
  }, []);

  const getCompliancePercentage = useCallback(() => {
    const all = controlsState.flatMap(c => c.safeguards);
    const compliant = all.filter(s => s.status === "compliant").length;
    return Math.round((compliant / all.length) * 100);
  }, [controlsState]);

  const getActiveRisksCount = useCallback(() => {
    return risks.filter(r => r.status === "Open").length;
  }, [risks]);

  const getNonCompliantControls = useCallback(() => {
    return controlsState.flatMap(c =>
      c.safeguards.filter(s => s.status === "non-compliant").map(s => ({
        controlTitle: c.title,
        safeguardId: s.id,
        safeguardTitle: s.title,
      }))
    );
  }, [controlsState]);

  return (
    <GRCContext.Provider value={{
      assets, risks, controls: controlsState,
      addAsset, updateAsset, deleteAsset,
      addRisk, updateRisk, deleteRisk,
      updateControlStatus,
      getCompliancePercentage, getActiveRisksCount, getNonCompliantControls,
    }}>
      {children}
    </GRCContext.Provider>
  );
}

export function useGRC() {
  const ctx = useContext(GRCContext);
  if (!ctx) throw new Error("useGRC must be used within GRCProvider");
  return ctx;
}
