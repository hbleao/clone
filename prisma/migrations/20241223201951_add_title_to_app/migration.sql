/*
  Warnings:

  - Added the required column `title` to the `apps` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_apps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "owner" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "apps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_apps" ("createdAt", "description", "id", "name", "owner", "slug", "updatedAt", "userId") SELECT "createdAt", "description", "id", "name", "owner", "slug", "updatedAt", "userId" FROM "apps";
DROP TABLE "apps";
ALTER TABLE "new_apps" RENAME TO "apps";
CREATE UNIQUE INDEX "apps_slug_key" ON "apps"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
