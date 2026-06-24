import { describe, expect, it } from "vitest";
import { sortValorantBoardEntries } from "@/lib/leaderboard-sort";

describe("sortValorantBoardEntries", () => {
  it("sorts by MMR descending with unique ranks", () => {
    const sorted = sortValorantBoardEntries([
      { rank: 17, mmr: null, rankTierId: 0, displayName: "Chicken" },
      { rank: 17, mmr: 1810, rankTierId: 21, displayName: "Ruben" },
      { rank: 12, mmr: 1914, rankTierId: 22, displayName: "Pwnsta" },
      { rank: 11, mmr: null, rankTierId: 0, displayName: "Hunterr" },
    ]);

    expect(sorted.map((e) => e.displayName)).toEqual([
      "Pwnsta",
      "Ruben",
      "Hunterr",
      "Chicken",
    ]);
    expect(sorted.map((e) => e.rank)).toEqual([1, 2, 3, 4]);
  });

  it("preserves stored slot order when all unranked (0 RR)", () => {
    const sorted = sortValorantBoardEntries([
      { rank: 2, mmr: null, rankTierId: 0, displayName: "Shanks" },
      { rank: 1, mmr: null, rankTierId: 0, displayName: "Vachan" },
      { rank: 3, mmr: null, rankTierId: 0, displayName: "Conor" },
    ]);

    expect(sorted.map((e) => e.displayName)).toEqual(["Vachan", "Shanks", "Conor"]);
    expect(sorted.map((e) => e.rank)).toEqual([1, 2, 3]);
  });

  it("one RR ranks above everyone at 0", () => {
    const sorted = sortValorantBoardEntries([
      { rank: 5, mmr: null, rankTierId: 0, displayName: "UnrankedA" },
      { rank: 10, mmr: 1, rankTierId: 6, displayName: "Bronze" },
      { rank: 1, mmr: null, rankTierId: 0, displayName: "UnrankedB" },
    ]);

    expect(sorted[0]?.displayName).toBe("Bronze");
    expect(sorted[0]?.rank).toBe(1);
  });
});
