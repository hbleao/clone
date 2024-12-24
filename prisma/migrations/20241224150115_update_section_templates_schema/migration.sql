-- CreateTable
CREATE TABLE "section_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT,
    "schema" TEXT NOT NULL,
    "defaultData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "appId" TEXT NOT NULL,
    CONSTRAINT "section_templates_appId_fkey" FOREIGN KEY ("appId") REFERENCES "apps" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
