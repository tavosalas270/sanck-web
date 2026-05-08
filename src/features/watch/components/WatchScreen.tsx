"use client"

import { useState } from 'react';
import { useSeries } from '../hooks/useWatch';
import { SeriesSection } from './SeriesSection';
import { VideoPlayerModal } from './VideoPlayerModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Videos } from '../schemas';

export const WatchScreen = () => {
    const querySeries = useSeries();
    const [selectedVideo, setSelectedVideo] = useState<Videos | null>(null);

    const handleEpisodeClick = (video: Videos) => {
        setSelectedVideo(video);
    };

    if (querySeries.isLoading) {
        return (
            <div className="min-h-screen w-full bg-snak-purple-dark p-4 md:p-12 space-y-12">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-6 w-full">
                        <Skeleton className="aspect-[21/7] w-full rounded-3xl bg-white/5" />
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4].map((j) => (
                                <Skeleton key={j} className="h-32 w-56 flex-shrink-0 rounded-xl bg-white/5" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const seriesData = querySeries.data?.pages.flatMap((page) => page) || [];

    return (
        <main className="min-h-screen w-full bg-snak-purple-dark text-white pb-20 overflow-x-hidden">
            <div className="max-w-[1440px] mx-auto p-4 md:p-12 space-y-16">
                {seriesData.length > 0 ? (
                    seriesData.map((series) => (
                        <SeriesSection
                            key={series.id}
                            series={series}
                            onEpisodeClick={handleEpisodeClick}
                        />
                    ))
                ) : (
                    <div className="h-[60vh] w-full flex items-center justify-center text-zinc-500 font-medium text-lg">
                        No hay series disponibles en este momento.
                    </div>
                )}

                {/* Infinite Scroll Trigger */}
                {querySeries.hasNextPage && (
                    <div
                        className="py-12 flex items-center justify-center"
                        ref={(el) => {
                            if (el && !querySeries.isFetchingNextPage) {
                                querySeries.fetchNextPage();
                            }
                        }}
                    >
                        <div className="size-10 rounded-full border-4 border-snak-pink border-t-transparent animate-spin" />
                    </div>
                )}
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <VideoPlayerModal
                    video={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </main>
    );
};