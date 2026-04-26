const API_BASE = "/api";

const ASSET_REPLACEMENTS = new Map([
  ["fire-emblem.jpg", "fire-emblem.jpg"],
  ["nintendo-music.jpg", "nintendo-music.jpg"],
  ["nintendo-store-app.jpg", "nintendo-store-app.jpg"],
  ["nintendo-today.jpg", "nintendo-today.jpg"],
  ["animalCrossing.jpg", "animal-crossing.jpg"],
  ["animalcrossing.jpg", "animal-crossing.jpg"],
  ["MarioTennis.jpg", "mario-tennis.jpg"],
  ["pokopia.jpg", "pokopia.jpg"],
  ["tomodachi-live.jpg", "tomodachi-live.jpg"],
  ["nintendo-switch-2-consola.jpg", "nintendo-switch-2-consola.jpg"],
  ["nintendo-switch-consola.jpg", "nintendo-switch-consola.jpg"],
  ["dragon-quest.jpg", "dragon-quest.jpg"],
  ["mario-kart-world.jpg", "mario-kart-world.jpg"],
  ["MARIOODY.jpg", "marioody.jpg"],
  ["monster-hunte.jpg", "monster-hunte.jpg"],
  ["NH.jpg", "nh.jpg"],
  ["PE.jpg", "pe.jpg"],
  ["resident-evil-requiem.jpg", "resident-evil-requiem.jpg"],
  ["TOTK.jpg", "totk.jpg"],
  ["icono-bolsa.png", "icono-bolsa.png"],
  ["icono-ayuda.png", "icono-ayuda.png"],
  ["icono-hardware.png", "icono-hardware.png"],
  ["nintendo-consola.png", "nintendo-consola.png"],
  ["nintendo-switch-2-logo.png", "nintendo-switch-2-logo.png"],
  ["nintendo-2.png", "nintendo-2.png"],
  ["nintendo-online.png", "nintendo-online.png"],
  ["nintendo-store.png", "nintendo-store.png"],
  ["nintendo-switch.png", "nintendo-switch.png"],
  ["nintend-control-parental.png", "nintend-control-parental.png"],
  ["acnh-collection-logo.jpg", "acnh-collection-logo.jpg"],
  ["super-mario-bros-40th-t-shirt.jpg", "super-mario-bros-40th-t-shirt.jpg"],
  ["tomodachi-life-ltd.jpg", "tomodachi-life-ltd.jpg"],
  ["16x9-ns-valentine-cards.jpg", "16x9-ns-valentine-cards.jpg"],
  ["mario-kart-world-online-tournament-february.jpg", "mario-kart-world-online-tournament-february.jpg"],
  ["mario-tennis-fever-5-tips.jpg", "mario-tennis-fever-5-tips.jpg"],
  ["upcoming-games-february-2026.jpg", "upcoming-games-february-2026.jpg"],
  ["weekly-download-news-week-05.jpg", "weekly-download-news-week-05.jpg"],
  ["weekly-download-news-week-06.jpg", "weekly-download-news-week-06.jpg"],
  ["weekly-download-news-week-07.jpg", "weekly-download-news-week-07.jpg"],
  ["HumanFallFlat.jpg", "human-fall-flat.jpg"],
  ["NSO_NES.jpg", "nso-nes.jpg"],
  ["RythmParadiseGroove.jpg", "rythm-paradise-groove.jpg"],
  ["bowser-y-hijo.png", "bowser-y-hijo.png"],
  ["mario-y-compania.png", "mario-y-compania.png"],
]);

export async function fetchJson(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} en ${path}`);
  }

  return response.json();
}

export function normalizeAssetPath(assetPath, fallback = "./fotos/placeholder.jpg") {
  if (!assetPath || typeof assetPath !== "string") {
    return fallback;
  }

  let normalizedPath = assetPath
    .replace(/\\/g, "/")
    .replace(/\/projecto_llm\//gi, "./")
    .replace(/^\/+projecto_llm\//i, "./")
    .replace(/^\/+/, "./");

  for (const [oldName, newName] of ASSET_REPLACEMENTS.entries()) {
    normalizedPath = normalizedPath.replace(oldName, newName);
  }

  return normalizedPath;
}

export const fetchCarouselData = () => fetchJson("/carrousel");
export const fetchNovedadesData = () => fetchJson("/novedades");
export const fetchNoticiasData = () => fetchJson("/noticias");
export const fetchJuegosData = () => fetchJson("/juegos");
export const fetchAplicacionesData = () => fetchJson("/aplicaciones");
export const fetchStoreData = () => fetchJson("/myNintendoStore");
