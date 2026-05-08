"use client"

import { useState, useMemo } from "react";
import Image from "next/image";
import { Series, Videos } from "../schemas";
import { formatUrl } from "@/lib/utils";
import { EpisodeCard } from "./EpisodeCard";
import { useVideos } from "../hooks/useWatch";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";

interface SeriesSectionProps {
    series: Series;
    onEpisodeClick: (video: Videos) => void;
    favoriteVideoIds?: Set<string>;
}

export const SeriesSection = ({ series, onEpisodeClick, favoriteVideoIds }: SeriesSectionProps) => {
    const [loadMore, setLoadMore] = useState(false);
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useVideos(series.id, 2, loadMore);

    const handleLoadMore = () => {
        if (!loadMore) {
            setLoadMore(true);
        } else {
            fetchNextPage();
        }
    };

    // Combinar los videos iniciales de la serie con los obtenidos por el hook de scroll infinito
    const extraVideos = useMemo(() => data?.pages.flat() || [], [data]);
    const allVideos = useMemo(() => [...series.videos, ...extraVideos], [series.videos, extraVideos]);

    // Lógica para mostrar la flecha:
    // 1. La serie inicial debe tener al menos 5 para permitir cargar más.
    // 2. Si ya empezamos a cargar, mostrar solo si hay una página siguiente disponible.
    const canShowMore = series.videos.length >= 5 && (!loadMore || hasNextPage);

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

                <div className="flex gap-4 overflow-x-auto pb-4 snak-scrollbar snap-x items-center">
                    {allVideos.length > 0 ? (
                        <>
                            {allVideos.map((video) => (
                                <EpisodeCard
                                    key={video.id}
                                    video={video}
                                    onClick={onEpisodeClick}
                                    isFavorite={favoriteVideoIds?.has(video.id.toString())}
                                />
                            ))}
                            
                            {canShowMore && (
                                <Button
                                    variant="ghost"
                                    onClick={handleLoadMore}
                                    disabled={isFetchingNextPage}
                                    className="flex-shrink-0 h-auto self-stretch min-h-[100px] w-12 bg-snak-purple-medium/10 hover:bg-snak-purple-medium/30 rounded-xl border border-white/5 transition-all duration-300 group"
                                >
                                    {isFetchingNextPage ? (
                                        <Loader2 className="size-6 text-snak-pink animate-spin" />
                                    ) : (
                                        <ChevronRight className="size-6 text-snak-blue-sky group-hover:text-snak-pink transition-colors" />
                                    )}
                                </Button>
                            )}
                        </>
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
