import type { LeaderboardPreviewEntry } from "@core/contracts";

/** Henrik tier id for unranked / no current act rank. */
export const UNRANKED_TIER_ID = 0;

/** Sort key only — unranked players count as 0 RR; UI still shows "--". */
export function effectiveBoardMmr(mmr: number | null | undefined): number {
  return mmr ?? 0;
}

export function isRankedEntry(mmr: number | null | undefined): boolean {
  return mmr != null;
}

type SortableEntry = Pick<
  LeaderboardPreviewEntry,
  "rank" | "storedBoardRank" | "mmr" | "rankTierId" | "displayName"
>;

function boardSlot(entry: SortableEntry): number {
  return entry.storedBoardRank ?? entry.rank ?? Number.MAX_SAFE_INTEGER;
}

export function compareValorantBoardEntries(
  a: SortableEntry,
  b: SortableEntry,
): number {
  const mmrDiff = effectiveBoardMmr(b.mmr) - effectiveBoardMmr(a.mmr);
  if (mmrDiff !== 0) return mmrDiff;

  const tierDiff = (b.rankTierId ?? 0) - (a.rankTierId ?? 0);
  if (tierDiff !== 0) return tierDiff;

  const slotDiff = boardSlot(a) - boardSlot(b);
  if (slotDiff !== 0) return slotDiff;

  return a.displayName.localeCompare(b.displayName);
}

/**
 * Board order: effective MMR descending (unranked = 0), then stored slot, then name.
 * Reassigns display ranks 1..n.
 */
export function sortValorantBoardEntries<T extends SortableEntry>(
  entries: T[],
): (T & { rank: number; storedBoardRank: number })[] {
  const withSlot = entries.map((entry) => ({
    ...entry,
    storedBoardRank: boardSlot(entry),
  }));

  const sorted = [...withSlot].sort(compareValorantBoardEntries);

  return sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

/** Snapshot stored ranks before sync — same sort as public board. */
export function computeValorantBoardSnapshotRanks<T extends SortableEntry>(
  entries: T[],
): (T & { rank: number })[] {
  return sortValorantBoardEntries(entries);
}
