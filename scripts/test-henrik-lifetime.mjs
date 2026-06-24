#!/usr/bin/env node
/**
 * Dev helper: fetch Henrik v2 lifetime peak + current act for one player.
 * Usage: dotenv -e .env.local -- node scripts/test-henrik-lifetime.mjs [name] [tag] [region]
 */
import "dotenv/config";

const region = process.argv[4] ?? "ap";
const name = process.argv[2] ?? "PaiN";
const tag = process.argv[3] ?? "eeee";
const apiKey = process.env.HENRIKDEV_API_KEY?.trim();
const currentAct = process.env.VALORANT_CURRENT_ACT?.trim().toLowerCase() ?? null;

if (!apiKey) {
  console.error("HENRIKDEV_API_KEY missing in .env.local");
  process.exit(1);
}

const url = `https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
const res = await fetch(url, {
  headers: { Authorization: apiKey, Accept: "application/json" },
});

if (!res.ok) {
  console.error("Henrik error", res.status, await res.text());
  process.exit(1);
}

const body = await res.json();
const data = body.data ?? {};
const current = data.current_data ?? {};
const highest = data.highest_rank ?? {};
const bySeason = data.by_season ?? {};

const actKey =
  currentAct ??
  current.season?.toLowerCase() ??
  null;

console.log(`Player: ${name}#${tag} (${region})`);
console.log("Tracking act:", actKey ?? "(set VALORANT_CURRENT_ACT in .env.local)");
console.log("API current tier:", current.currenttierpatched ?? "Unranked");
console.log("Lifetime peak:", highest.patched_tier ?? "—", `(act ${highest.season ?? "—"})`);

if (actKey) {
  const stats =
    bySeason[actKey] ??
    bySeason[actKey.replace(/^s/, "e")] ??
    bySeason[actKey.replace(/^e/, "s")];
  if (!stats || stats.error) {
    console.log(`Act ${actKey}: NO VALID RANK → show Unranked, RR --`);
  } else if ((stats.number_of_games ?? 0) <= 0) {
    console.log(`Act ${actKey}: no games → show Unranked, RR --`);
  } else {
    console.log(
      `Act ${actKey}: ${stats.final_rank_patched ?? "Unranked"} (${stats.number_of_games} games)`,
    );
  }
}

let lifetimeGames = 0;
for (const stats of Object.values(bySeason)) {
  if (stats && typeof stats === "object" && !("error" in stats)) {
    lifetimeGames += Number(stats.number_of_games ?? 0);
  }
}
console.log("Lifetime ranked games (sum of acts):", lifetimeGames);
