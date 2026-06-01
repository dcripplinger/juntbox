export type LayerTier = "popupMenu" | "modal";

export const layerTiers: Record<LayerTier, number> = {
  popupMenu: 1000,
  modal: 1100,
};

