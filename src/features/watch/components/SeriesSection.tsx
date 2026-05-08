"use client"

import Image from "next/image";
import { Series, Videos } from "../schemas";
import { formatUrl } from "@/lib/utils";
import { EpisodeCard } from "./EpisodeCard";

interface SeriesSectionProps {
    series: Series;
    onEpisodeClick: (video: Videos) => void;
}

export const SeriesSection = ({ series, onEpisodeClick }: SeriesSectionProps) => {
    return (
        <section className="w-full space-y-6 mb-12 last:mb-0">
            {/* Poster and Title Section */}
            <div className="relative w-full aspect-[21/9] md:aspect-[21/7] rounded-3xl overflow-hidden shadow-2xl bg-snak-purple-medium/20">
                {formatUrl(series.poster) && (
                    <Image
                        src={formatUrl(series.poster)!}
                        alt={series.title}
                        fill
                        priority
                        className="object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-snak-purple-dark via-snak-purple-dark/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
                    <h2 className="text-4xl md:text-6xl font-heading text-white drop-shadow-2xl tracking-tight">
                        {series.title}
                    </h2>
                </div>
            </div>

            {/* Episodes Row */}
            <div className="px-4 md:px-0">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-heading text-snak-blue-sky">
                        Capítulos
                    </h3>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {series.videos.length > 0 ? (
                        series.videos.map((video) => (
                            <EpisodeCard
                                key={video.id}
                                video={video}
                                onClick={onEpisodeClick}
                            />
                        ))
                    ) : (
                        <p className="text-zinc-500 text-sm italic">
                            No hay capítulos disponibles para esta serie.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};
