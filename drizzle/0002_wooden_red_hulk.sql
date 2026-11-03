ALTER TABLE "canvas_squares" ALTER COLUMN "color" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "canvas_squares" ALTER COLUMN "color" SET DEFAULT 'white'::text;--> statement-breakpoint
UPDATE "canvas_squares" SET "color" = 'white' WHERE "color" NOT IN ('white', 'red', 'green', 'blue');--> statement-breakpoint
DROP TYPE "public"."canvas_color";--> statement-breakpoint
CREATE TYPE "public"."canvas_color" AS ENUM('white', 'red', 'green', 'blue');--> statement-breakpoint
ALTER TABLE "canvas_squares" ALTER COLUMN "color" SET DEFAULT 'white'::"public"."canvas_color";--> statement-breakpoint
ALTER TABLE "canvas_squares" ALTER COLUMN "color" SET DATA TYPE "public"."canvas_color" USING "color"::"public"."canvas_color";