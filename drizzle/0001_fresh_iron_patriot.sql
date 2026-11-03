ALTER TABLE "canvas_squares" DROP CONSTRAINT "canvas_squares_valid_x";--> statement-breakpoint
ALTER TABLE "canvas_squares" DROP CONSTRAINT "canvas_squares_valid_y";--> statement-breakpoint
UPDATE "canvas_squares" SET "x" = "x" + 10, "y" = "y" + 10;--> statement-breakpoint
UPDATE "canvas_squares" SET "x" = "x" - 9, "y" = "y" - 9;--> statement-breakpoint
ALTER TABLE "canvas_squares" ADD CONSTRAINT "canvas_squares_valid_x" CHECK ("canvas_squares"."x" between 1 and 5);--> statement-breakpoint
ALTER TABLE "canvas_squares" ADD CONSTRAINT "canvas_squares_valid_y" CHECK ("canvas_squares"."y" between 1 and 5);