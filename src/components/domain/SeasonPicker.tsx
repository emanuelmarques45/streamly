"use client";

import clsx from "clsx";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSeason } from "@/services/catalog.client";
import { Season } from "@/types/TvShow";
import { formatYear } from "@/utils/format";
import { Spinner } from "../ui/Spinner";
import { EpisodeList } from "./EpisodeList";

type SeasonPickerProps = {
  tvId: number;
  seasons: Season[];
};

/**
 * The TV show page used to render the episodes of *every* season on the server:
 * one request per season and a huge page. Only the selected season is fetched
 * now, on demand.
 */
export function SeasonPicker({ tvId, seasons }: SeasonPickerProps) {
  // Season 0 holds specials; start on the first regular season.
  const regular = seasons.filter((season) => season.season_number > 0);
  const available = regular.length ? regular : seasons;

  const [selected, setSelected] = useState(
    available[0]?.season_number ?? 1
  );

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["season", tvId, selected],
    queryFn: ({ signal }) => fetchSeason(tvId, selected, signal),
    staleTime: 60 * 60 * 1000,
  });

  if (!available.length) {
    return (
      <p className='text-sm text-text-muted'>
        Este título ainda não tem temporadas cadastradas.
      </p>
    );
  }

  const current = available.find((s) => s.season_number === selected);

  return (
    <section>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-4'>
        <h2 className='text-xl font-semibold'>Episódios</h2>

        <label className='flex items-center gap-2 text-sm'>
          <span className='sr-only'>Temporada</span>
          <select
            value={selected}
            onChange={(event) => setSelected(Number(event.target.value))}
            className='rounded-lg border border-border bg-background px-3 py-2 text-sm'
          >
            {available.map((season) => (
              <option key={season.id} value={season.season_number}>
                {season.name}
                {season.air_date ? ` (${formatYear(season.air_date)})` : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      {current?.overview && (
        <p className='mb-4 text-sm text-text-muted'>{current.overview}</p>
      )}

      <div
        className={clsx(
          "min-h-32",
          isPending && "flex items-center justify-center"
        )}
      >
        {isPending && <Spinner />}

        {isError && (
          <div className='flex items-center gap-4 text-sm'>
            <p className='text-text-muted'>
              Não foi possível carregar os episódios.
            </p>
            <button
              onClick={() => refetch()}
              className='rounded-md border border-border px-3 py-1 hover:bg-text/10'
            >
              Tentar de novo
            </button>
          </div>
        )}

        {data && <EpisodeList episodes={data.episodes} />}
      </div>
    </section>
  );
}
