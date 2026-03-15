-- Backfill values before tightening constraints.
UPDATE "user"
SET
  "role" = 'user'
WHERE
  "role" IS NULL;

UPDATE "user"
SET
  "banned" = false
WHERE
  "banned" IS NULL;

UPDATE "foodServingUnit"
SET
  "grams" = 1
WHERE
  "grams" IS NULL;

-- Rename legacy timestamp columns instead of recreating them.
ALTER TABLE "category"
RENAME COLUMN "createAt" TO "createdAt";

ALTER TABLE "food"
RENAME COLUMN "updateAt" TO "updatedAt";

ALTER TABLE "foodServingUnit"
RENAME COLUMN "updateAt" TO "updatedAt";

ALTER TABLE "meal"
RENAME COLUMN "updateAt" TO "updatedAt";

ALTER TABLE "servingUnit"
RENAME COLUMN "updateAt" TO "updatedAt";

-- Remove obsolete direct relations now that join tables are the source of truth.
ALTER TABLE "food"
DROP CONSTRAINT "food_mealId_fkey";

ALTER TABLE "servingUnit"
DROP CONSTRAINT "servingUnit_foodId_fkey";

ALTER TABLE "foodServingUnit"
DROP CONSTRAINT "foodServingUnit_foodId_fkey";

ALTER TABLE "mealFood"
DROP CONSTRAINT "mealFood_mealId_fkey";

ALTER TABLE "food"
DROP COLUMN "mealId";

ALTER TABLE "servingUnit"
DROP COLUMN "foodId";

-- Tighten existing columns after the backfill.
ALTER TABLE "user"
ALTER COLUMN "role" SET DEFAULT 'user',
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "banned" SET DEFAULT false,
ALTER COLUMN "banned" SET NOT NULL;

ALTER TABLE "foodServingUnit"
ALTER COLUMN "grams" SET NOT NULL;

DELETE FROM "foodServingUnit" AS duplicate
USING "foodServingUnit" AS original
WHERE
  duplicate."id" > original."id"
  AND duplicate."foodId" = original."foodId"
  AND duplicate."servingUnitId" = original."servingUnitId";

-- Recreate foreign keys with the intended referential actions.
ALTER TABLE "foodServingUnit"
ADD CONSTRAINT "foodServingUnit_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "mealFood"
ADD CONSTRAINT "mealFood_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Supporting indexes and uniqueness constraints.
CREATE INDEX "session_expiresAt_idx" ON "session"("expiresAt");

CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");

CREATE INDEX "verification_expiresAt_idx" ON "verification"("expiresAt");

CREATE UNIQUE INDEX "verification_identifier_value_key" ON "verification"("identifier", "value");

CREATE INDEX "food_categoryId_idx" ON "food"("categoryId");

CREATE INDEX "foodServingUnit_servingUnitId_idx" ON "foodServingUnit"("servingUnitId");

CREATE UNIQUE INDEX "foodServingUnit_foodId_servingUnitId_key" ON "foodServingUnit"("foodId", "servingUnitId");

CREATE INDEX "meal_dateTime_idx" ON "meal"("dateTime");

CREATE INDEX "meal_userId_dateTime_idx" ON "meal"("userId", "dateTime");

CREATE INDEX "mealFood_foodId_idx" ON "mealFood"("foodId");

CREATE INDEX "mealFood_mealId_idx" ON "mealFood"("mealId");

CREATE INDEX "mealFood_servingUnitId_idx" ON "mealFood"("servingUnitId");

DROP TYPE IF EXISTS "Role";
