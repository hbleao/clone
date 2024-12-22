-- AlterTable
ALTER TABLE "apps" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';
CREATE UNIQUE INDEX "apps_slug_key" ON "apps"("slug");
