/*
  Warnings:

  - You are about to drop the column `defaultData` on the `components` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `components` table. All the data in the column will be lost.
  - You are about to drop the column `canonical` on the `seos` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `seos` table. All the data in the column will be lost.
  - You are about to drop the column `ogDescription` on the `seos` table. All the data in the column will be lost.
  - You are about to drop the column `ogImage` on the `seos` table. All the data in the column will be lost.
  - You are about to drop the column `ogTitle` on the `seos` table. All the data in the column will be lost.
  - You are about to drop the column `robots` on the `seos` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "page_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "appId" TEXT NOT NULL,
    CONSTRAINT "page_templates_appId_fkey" FOREIGN KEY ("appId") REFERENCES "apps" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "page_template_components" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "initialData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "page_template_components_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "page_templates" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "page_template_components_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "components" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_components" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "schema" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "appId" TEXT NOT NULL,
    CONSTRAINT "components_appId_fkey" FOREIGN KEY ("appId") REFERENCES "apps" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_components" ("appId", "createdAt", "description", "id", "name", "schema", "type", "updatedAt") SELECT "appId", "createdAt", "description", "id", "name", "schema", "type", "updatedAt" FROM "components";
DROP TABLE "components";
ALTER TABLE "new_components" RENAME TO "components";
CREATE TABLE "new_pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "type" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    "templateId" TEXT,
    CONSTRAINT "pages_appId_fkey" FOREIGN KEY ("appId") REFERENCES "apps" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pages_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "page_templates" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_pages" ("appId", "author", "content", "createdAt", "id", "publishedAt", "slug", "status", "title", "type", "updatedAt") SELECT "appId", "author", "content", "createdAt", "id", "publishedAt", "slug", "status", "title", "type", "updatedAt" FROM "pages";
DROP TABLE "pages";
ALTER TABLE "new_pages" RENAME TO "pages";
CREATE UNIQUE INDEX "pages_appId_slug_key" ON "pages"("appId", "slug");
CREATE TABLE "new_seos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "seos_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_seos" ("createdAt", "description", "id", "pageId", "title", "updatedAt") SELECT "createdAt", "description", "id", "pageId", "title", "updatedAt" FROM "seos";
DROP TABLE "seos";
ALTER TABLE "new_seos" RENAME TO "seos";
CREATE UNIQUE INDEX "seos_pageId_key" ON "seos"("pageId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "page_template_components_templateId_position_key" ON "page_template_components"("templateId", "position");
