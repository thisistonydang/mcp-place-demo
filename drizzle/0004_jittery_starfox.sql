ALTER TABLE "canvas_squares" DROP CONSTRAINT "canvas_squares_valid_x";--> statement-breakpoint
ALTER TABLE "canvas_squares" ALTER COLUMN "x" SET DATA TYPE text USING chr(64 + "x");--> statement-breakpoint
ALTER TABLE "canvas_squares" ADD CONSTRAINT "canvas_squares_valid_x" CHECK ("canvas_squares"."x" in ('A', 'B', 'C', 'D', 'E'));