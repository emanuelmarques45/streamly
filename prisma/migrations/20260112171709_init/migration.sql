/*
  Warnings:

  - You are about to drop the column `movieId` on the `Favorite` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemType` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Favorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "itemType" TEXT NOT NULL,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Favorite" ("id", "userId") SELECT "id", "userId" FROM "Favorite";
DROP TABLE "Favorite";
ALTER TABLE "new_Favorite" RENAME TO "Favorite";
CREATE UNIQUE INDEX "Favorite_userId_itemId_itemType_key" ON "Favorite"("userId", "itemId", "itemType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
