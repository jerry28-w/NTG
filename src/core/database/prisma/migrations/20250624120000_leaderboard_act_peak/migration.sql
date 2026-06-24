-- AlterTable
ALTER TABLE "LeaderboardEntry" ADD COLUMN IF NOT EXISTS "currentAct" TEXT;
ALTER TABLE "LeaderboardEntry" ADD COLUMN IF NOT EXISTS "peakRankTier" TEXT;
ALTER TABLE "LeaderboardEntry" ADD COLUMN IF NOT EXISTS "peakRankTierId" INTEGER;
ALTER TABLE "LeaderboardEntry" ADD COLUMN IF NOT EXISTS "peakAct" TEXT;
