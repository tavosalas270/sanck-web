"use client"

import { useMemo } from "react";
import { Series, Videos } from "../schemas";
import { EpisodeCard } from "./EpisodeCard";

interface VideosFilteredProps {
    series: Series[];
    searchQuery: string;
    onEpisodeClick: (video: Videos) => void;
}

export const VideosFiltered = ({ series, searchQuery, onEpisodeClick }: VideosFilteredProps) => {
    const filteredVideos = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
        
        // Extraemos todos los videos de todas las series cargadas
        const allVideos: Videos[] = [];
        const seenIds = new Set<number>();

        series.forEach(s => {
            s.videos.forEach(v => {
                if (!seenIds.has(v.id)) {
                    allVideos.push(v);
                    seenIds.add(v.id);
                }
            });
        });

        return allVideos.filter(v => v.title.toLowerCase().includes(query));
    }, [series, searchQuery]);

    if (filteredVideos.length === 0) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center text-zinc-500 animate-in fade-in duration-500">
                <p className="text-lg font-medium">No se encontraron videos con "{searchQuery}"</p>
                <p className="text-sm italic mt-2">Intenta con otro título o palabra clave</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-snak-pink rounded-full" />
                <h2 className="text-2xl font-heading text-white">
                    Resultados para: <span className="text-snak-blue-sky">{searchQuery}</span>
                </h2>
                <span className="text-zinc-500 text-sm ml-auto">
                    {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredVideos.map((video) => (
                    <div key={video.id} className="flex justify-center">
                        <EpisodeCard
                            video={video}
                            onClick={onEpisodeClick}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
