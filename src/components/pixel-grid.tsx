import { useLiveQuery } from "@neon/realtime-react";
import { useEffect, useState } from "react";
import type { SealedLiveQuery } from "@neon/realtime/client";

import type { CanvasSquare } from "../../db/schema";
import {
  COLOR_VALUES,
  X_AXIS,
  Y_AXIS,
  createCanvas,
  squareKey,
} from "#/lib/canvas";
import { fetchSealedCanvasQuery } from "#/lib/realtime";

function Grid({ squares = [] }: { squares?: ReadonlyArray<CanvasSquare> }) {
  const canvas = createCanvas(squares);

  return (
    <div className="w-full max-w-[620px]">
      <div
        aria-label="5 by 5 live pixel canvas"
        className="grid grid-cols-[2rem_repeat(5,minmax(0,1fr))] grid-rows-[2rem_repeat(5,minmax(0,1fr))] gap-1"
        role="grid"
      >
        <span aria-hidden="true" />
        {X_AXIS.map((x) => (
          <span
            className="grid place-items-center text-base font-semibold text-subtle sm:text-lg"
            key={x}
          >
            {x}
          </span>
        ))}
        {Y_AXIS.map((y) => (
          <div className="contents" key={y}>
            <span className="grid place-items-center text-base font-semibold text-subtle sm:text-lg">
              {y}
            </span>
            {canvas
              .filter((square) => square.y === y)
              .map((square) => (
                <div
                  aria-label={`Square x ${square.x}, y ${square.y}: ${square.color}`}
                  className="aspect-square rounded-sm border-2 border-highlight-high shadow-sm transition-colors duration-300"
                  key={squareKey(square.x, square.y)}
                  role="gridcell"
                  style={{ backgroundColor: COLOR_VALUES[square.color] }}
                  title={`x=${square.x}, y=${square.y}: ${square.color}`}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveGrid({
  sealedQuery,
}: {
  sealedQuery: SealedLiveQuery<CanvasSquare>;
}) {
  const { data, error, status } = useLiveQuery(sealedQuery, {
    refreshQuery: fetchSealedCanvasQuery,
  });

  if (status === "error") {
    return (
      <p className="text-center text-love" role="alert">
        Live updates stopped: {error.message}
      </p>
    );
  }

  return <Grid squares={data} />;
}

export function PixelGrid() {
  const [sealedQuery, setSealedQuery] =
    useState<SealedLiveQuery<CanvasSquare>>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    fetchSealedCanvasQuery().then(
      (query) => {
        if (!cancelled) setSealedQuery(query);
      },
      (reason: unknown) => {
        if (!cancelled)
          setError(reason instanceof Error ? reason.message : "Unknown error");
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (error)
    return (
      <p className="text-center text-love" role="alert">
        Could not open the live canvas: {error}
      </p>
    );
  if (!sealedQuery) return <Grid />;
  return <LiveGrid sealedQuery={sealedQuery} />;
}
