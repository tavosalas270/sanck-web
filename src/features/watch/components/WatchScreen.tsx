"use client"

import { useSeries } from '../hooks/useWatch';
import { VideoItem } from './VideoItem';
import { Skeleton } from '@/components/ui/skeleton';

export const WatchScreen = () => {
    const querySeries = useSeries();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    
    const formatUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        let cleanPath = path.startsWith('/') ? path : `/${path}`;
        
        // Si la base no termina en /media y el path no empieza con /media, lo insertamos (Requerido por Django)
        if (!cleanBase.endsWith('/media') && !cleanPath.startsWith('/media/')) {
            cleanPath = `/media${cleanPath}`;
        }
        
        return `${cleanBase}${cleanPath}`;
    };

    // Flatten all videos from all series for the feed
    const allVideos = querySeries.data?.pages.flatMap((page) => 
        page.flatMap(series => 
            series.videos.map(video => ({
                ...video,
                username: series.title, // Using series title as username for now
                avatarUrl: formatUrl(series.poster),
                videoUrl: formatUrl(video.video_path),
                thumbnailUrl: formatUrl(video.thumbnail_path)
            }))
        )
    ) || [];

    if (querySeries.isLoading) {
        return (
            <div className="h-screen w-full bg-snak-purple-dark flex items-center justify-center p-4">
                <div className="space-y-4 w-full max-w-md">
                    <Skeleton className="h-[70vh] w-full rounded-2xl bg-white/5" />
                    <div className="flex gap-4">
                        <Skeleton className="size-12 rounded-full bg-white/5" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/3 bg-white/5" />
                            <Skeleton className="h-4 w-full bg-white/5" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
            {allVideos.length > 0 ? (
                allVideos.map((video) => (
                    <VideoItem
                        key={`${video.id}-${video.title}`}
                        videoUrl={video.videoUrl}
                        username={video.username}
                        description={video.description}
                        avatarUrl={video.avatarUrl}
                        thumbnailUrl={video.thumbnailUrl}
                        likes="125.4K" // Placeholders for now as per schema
                        comments="1.2K"
                        tokens="10"
                    />
                ))
            ) : (
                <div className="h-screen w-full flex items-center justify-center text-white/50 font-medium">
                    No videos available at the moment.
                </div>
            )}
            
            {/* Infinite Scroll Trigger */}
            {querySeries.hasNextPage && (
                <div 
                    className="h-20 flex items-center justify-center snap-center"
                    ref={(el) => {
                        if (el && !querySeries.isFetchingNextPage) {
                            querySeries.fetchNextPage();
                        }
                    }}
                >
                    <div className="size-8 rounded-full border-2 border-snak-pink border-t-transparent animate-spin" />
                </div>
            )}
        </main>
    );
};