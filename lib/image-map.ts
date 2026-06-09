const PLACEHOLDER = "/images/placeholder-cover.svg";

// Steam App IDs that have local cover + screenshot files under /public/images/games/
const LOCAL_APP_IDS = new Set([
  // Initial 10 games
  "1245620", // Elden Ring
  "1091500", // Cyberpunk 2077
  "1174180", // Red Dead Redemption 2
  "1593500", // God of War
  "1086940", // Baldur's Gate 3
  "1145360", // Hades
  "367520",  // Hollow Knight
  "413150",  // Stardew Valley
  "292030",  // The Witcher 3
  "730",     // Counter-Strike 2
  // Additional 40 games
  "990080",  // Hogwarts Legacy
  "271590",  // Grand Theft Auto V
  "1716740", // Starfield
  "2050650", // Resident Evil 4
  "1672970", // Minecraft
  "1551360", // Forza Horizon 5
  "1151640", // Horizon Zero Dawn
  "814380",  // Sekiro: Shadows Die Twice
  "782330",  // DOOM Eternal
  "582010",  // Monster Hunter: World
  "1190460", // Death Stranding
  "632470",  // Disco Elysium
  "374320",  // Dark Souls III
  "105600",  // Terraria
  "945360",  // Among Us
  "1172470", // Apex Legends
  "570",     // Dota 2
  "892970",  // Valheim
  "381210",  // Dead by Daylight
  "1426210", // It Takes Two
  "504230",  // Celeste
  "289070",  // Civilization VI
  "264710",  // Subnautica
  "526870",  // Satisfactory
  "427520",  // Factorio
  "620",     // Portal 2
  "546560",  // Half-Life: Alyx
  "550",     // Left 4 Dead 2
  "252490",  // Rust
  "346110",  // ARK: Survival Evolved
  "435150",  // Divinity: Original Sin 2
  "218620",  // PAYDAY 2
  "534380",  // Dying Light 2
  "949230",  // Cities: Skylines II
  "242760",  // The Forest
  "1326470", // Sons of the Forest
  "1623730", // Palworld
  "1966720", // Lethal Company
  "739630",  // Phasmophobia
  "1172620", // Sea of Thieves
]);

function steamAppId(url: string): string | null {
  const m = url.match(/\/apps\/(\d+)\//);
  return m ? m[1] : null;
}

/** Resolves a Steam cover URL to a local path, or a placeholder. */
export function resolveGameCover(steamUrl: string): string {
  const appId = steamAppId(steamUrl);
  if (appId && LOCAL_APP_IDS.has(appId)) {
    return `/images/games/${appId}-cover.jpg`;
  }
  return PLACEHOLDER;
}

/**
 * Resolves Steam screenshot URLs to local paths.
 * Falls back to the resolved cover when no local screenshots exist.
 */
export function resolveGameScreenshots(
  steamScreenshots: string[],
  steamCoverUrl: string,
): string[] {
  const appId =
    steamScreenshots.length > 0
      ? steamAppId(steamScreenshots[0])
      : steamAppId(steamCoverUrl);

  if (appId && LOCAL_APP_IDS.has(appId)) {
    return [
      `/images/games/${appId}-ss1.jpg`,
      `/images/games/${appId}-ss2.jpg`,
    ];
  }

  return [resolveGameCover(steamCoverUrl)];
}
