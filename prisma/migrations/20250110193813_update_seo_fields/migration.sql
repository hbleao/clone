/*
  Warnings:

  - You are about to drop the column `Keywords` on the `seos` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_seos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "keywords" TEXT,
    "canonical" TEXT,
    "robots" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "seos_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_seos" ("canonical", "createdAt", "description", "id", "pageId", "robots", "title", "updatedAt") SELECT "canonical", "createdAt", "description", "id", "pageId", "robots", "title", "updatedAt" FROM "seos";
DROP TABLE "seos";
ALTER TABLE "new_seos" RENAME TO "seos";
CREATE UNIQUE INDEX "seos_pageId_key" ON "seos"("pageId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
