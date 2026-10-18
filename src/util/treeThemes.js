/**
 * treeThemes.js
 * Clean & Simple Customization Configuration for Bloodline Family Tree
 */

export const BORDER_STYLES = [
  { id: "glow", label: "Neon Glow" },
  { id: "clean", label: "Subtle Line" },
  { id: "gold", label: "Gold Rim" },
  { id: "double", label: "Double Line" },
  { id: "dashed", label: "Dashed" },
  { id: "none", label: "None" },
];

export const BG_DETAILINGS = [
  { id: "none", label: "None" },
  { id: "dots", label: "Dots Pattern" },
  { id: "stars", label: "Star Dust" },
  { id: "grid", label: "Minimal Grid" },
];

export const CANVAS_FRAMES = [
  { id: "none", label: "None" },
  { id: "ornate-gold", label: "Royal Gold" },
  { id: "heritage-filigree", label: "Vintage Filigree" },
  { id: "art-deco", label: "Art Deco" },
  { id: "mahogany-wood", label: "Classic Wood" },
];

export const DEFAULT_CUSTOMIZATION = {
  hasBox: false,              // true: wrap in box, false: classic tree
  boxOrientation: "vertical", // 'vertical' (photo on top) or 'horizontal' (photo on side)
  cardStyle: "classic",       // 'classic', 'fade-box', 'side-box'
  boxRadius: 14,              // 0px to 28px
  boxBorderStyle: "clean",    // border style for boxes
  photoSize: 64,              // 44px to 100px
  photoRadius: 50,            // 0% (square) to 50% (circle)
  imageBorderStyle: "glow",   // border style for images
  nodeHGap: 18,               // 8px to 40px
  nodeVGap: 50,               // 30px to 80px
  mateGap: 20,                // 10px to 40px
  bgDetailing: "none",        // canvas background detailing ('none', 'dots', 'stars', 'grid')
  canvasFrame: "none",        // canvas frame ('none', 'ornate-gold', 'heritage-filigree', 'art-deco', 'mahogany-wood')
  bgAnimation: true,          // ambient floating animation toggle
};

const STORAGE_KEY = "bloodline_tree_custom_v5";

export function computeCardStyle(hasBox, boxOrientation) {
  if (!hasBox) return "classic";
  return boxOrientation === "horizontal" ? "side-box" : "fade-box";
}

export function loadSavedCustomization() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.hasBox === undefined) {
          parsed.hasBox = parsed.cardStyle && parsed.cardStyle !== "classic";
          parsed.boxOrientation = parsed.cardStyle === "side-box" ? "horizontal" : "vertical";
        }
        parsed.cardStyle = computeCardStyle(parsed.hasBox, parsed.boxOrientation);
        return { ...DEFAULT_CUSTOMIZATION, ...parsed };
      }
    }
  } catch (e) {
    console.error("Error loading tree customization:", e);
  }
  return { ...DEFAULT_CUSTOMIZATION };
}

export function saveCustomizationToStorage(customization) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      customization.cardStyle = computeCardStyle(customization.hasBox, customization.boxOrientation);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customization));
    }
  } catch (e) {
    console.error("Error saving tree customization:", e);
  }
}

export function generateTreeCssVars(customization) {
  const photoSize = Number(customization.photoSize) || 64;
  const photoRadius = customization.photoRadius !== undefined ? Number(customization.photoRadius) : 50;
  const boxRadius = customization.boxRadius !== undefined ? Number(customization.boxRadius) : 14;
  const nodeHGap = Number(customization.nodeHGap) || 18;
  const nodeVGap = Number(customization.nodeVGap) || 50;
  const mateGap = Number(customization.mateGap) || 20;
  const cardStyle = computeCardStyle(customization.hasBox, customization.boxOrientation);

  let cardWidth = `${photoSize + 40}px`;
  if (cardStyle === "side-box") {
    cardWidth = `${photoSize + 110}px`;
  } else if (cardStyle === "classic") {
    cardWidth = `${Math.max(photoSize + 24, 88)}px`;
  }

  const mateLineTop = `${photoSize / 2 + 10}px`;

  return {
    "--tree-photo-size": `${photoSize}px`,
    "--tree-photo-radius": `${photoRadius}%`,
    "--tree-box-radius": `${boxRadius}px`,
    "--tree-card-width": cardWidth,
    "--tree-node-h-gap": `${nodeHGap}px`,
    "--tree-node-v-gap": `${nodeVGap}px`,
    "--tree-mate-gap": `${mateGap}px`,
    "--tree-mate-line-top": mateLineTop,
    "--tree-connector-width": "2px",
    "--tree-connector-color": "rgba(79, 142, 247, 0.7)",
    "--tree-connector-glow": "drop-shadow(0 0 4px rgba(79, 142, 247, 0.8))",
    "--tree-card-bg": "rgba(15, 17, 35, 0.95)",
    "--tree-text-color": "#ffffff",
    "--tree-text-shadow": "0 2px 4px rgba(0, 0, 0, 0.6)",
    "--tree-accent-color": "#4f8ef7",
  };
}
