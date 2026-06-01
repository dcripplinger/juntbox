import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { layerTiers, type LayerTier } from "./layers";

type RegisterResult = {
  zIndex: number;
  unregister: () => void;
};

type LayerContextValue = {
  registerLayer: (requestedBaseZIndex: number) => RegisterResult;
  getTierBase: (tier: LayerTier) => number;
};

const LayerContext = createContext<LayerContextValue | null>(null);

type ActiveLayer = { id: string; zIndex: number };

function getTopZIndex(active: ActiveLayer[]): number {
  return active.reduce((max, l) => Math.max(max, l.zIndex), 0);
}

export function LayerProvider({ children }: { children: ReactNode }) {
  const [, setActiveLayers] = useState<ActiveLayer[]>([]);
  const activeLayersRef = useRef<ActiveLayer[]>([]);
  const ids = useRef(0);

  const registerLayer = useCallback((requestedBaseZIndex: number) => {
    const id = `layer_${ids.current++}`;

    // "Bump by depth": every new layer stacks above the current top, even if it
    // has a lower "tier" base (e.g. a popup menu opened from within a modal).
    const top = getTopZIndex(activeLayersRef.current);
    const assigned = Math.max(requestedBaseZIndex, top + 1);
    const next = [...activeLayersRef.current, { id, zIndex: assigned }];
    activeLayersRef.current = next;
    setActiveLayers(next);

    const unregister = () => {
      const filtered = activeLayersRef.current.filter((l) => l.id !== id);
      activeLayersRef.current = filtered;
      setActiveLayers(filtered);
    };

    return { zIndex: assigned, unregister };
  }, []);

  const value = useMemo<LayerContextValue>(
    () => ({
      registerLayer,
      getTierBase: (tier) => layerTiers[tier],
    }),
    [registerLayer],
  );

  return <LayerContext.Provider value={value}>{children}</LayerContext.Provider>;
}

export function useLayerManager(): LayerContextValue {
  const ctx = useContext(LayerContext);
  if (!ctx) throw new Error("useLayerManager must be used within LayerProvider");
  return ctx;
}

