"use client"

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSeries, useCategories, useFavorites, useUserData, useSearchVideos } from '../hooks/useWatch';
import {
    SeriesSection,
    VideosFiltered,
    VideoPlayerModal,
    FavoriteScreen,
    ComingSoon
} from './index';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Videos } from '../schemas';
import { Input } from '@/components/ui/input';
import { Search, X, Filter, PlayCircle, Heart, Coins, Loader2, Gamepad2, CircleDollarSign, MessageSquare, Smartphone } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

export const WatchScreen = () => {
    const queryClient = useQueryClient();
    const querySeries = useSeries();
    const queryCategories = useCategories();
    const queryFavorites = useFavorites();
    const { data: userData, isLoading: isUserLoading } = useUserData();

    const [activeTab, setActiveTab] = useState('watch');
    const [selectedVideo, setSelectedVideo] = useState<Videos | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

    const { data: searchResults } = useSearchVideos(
        searchQuery.trim() || undefined,
        selectedCategoryId === '' || selectedCategoryId === 'all' ? undefined : selectedCategoryId
    );

    const handleEpisodeClick = (video: Videos) => {
        setSelectedVideo(video);
    };

    const isFiltering = (searchQuery.trim().length > 0) || (selectedCategoryId !== '' && selectedCategoryId !== 'all');

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
    const categories = queryCategories.data || [];

    return (
        <main className="min-h-screen w-full bg-snak-purple-dark text-white pb-20 overflow-x-hidden relative">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Header / Search Section Sticky */}
                <header className="sticky top-0 z-50 w-full bg-snak-purple-dark/80 backdrop-blur-md border-b border-white/5 px-4 md:px-12 py-4">
                    <div className="max-w-[1440px] mx-auto space-y-6">
                        {/* Top Row: Title, Tabs and Tokens */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                                <h1 className="text-2xl font-heading text-white">
                                    Explorar
                                </h1>

                                <div className="flex items-center gap-3">
                                    {/* Download for Android Button (Mobile/Tablet) */}
                                    <Button asChild className="flex md:hidden rounded-full bg-snak-pink hover:bg-snak-pink/90 text-white border-none font-bold text-xs px-3 h-8 shadow-[0_0_15px_rgba(191,15,180,0.3)] transition-all">
                                        <a href="/download-apk">
                                            <Smartphone className="size-3.5" />
                                            <span>Download APK</span>
                                        </a>
                                    </Button>

                                    {/* Tokens Balance (Mobile) */}
                                    <div className="flex sm:hidden items-center gap-2 bg-snak-pink/20 border border-snak-pink/30 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(191,15,180,0.2)]">
                                        <Coins className="size-4 text-snak-pink animate-pulse" />
                                        {isUserLoading ? (
                                            <Loader2 className="size-3 animate-spin text-snak-pink" />
                                        ) : (
                                            <span className="text-sm font-black text-white">{userData?.tokens || 0}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
                                {/* Download for Android Button (Desktop) */}
                                <Button asChild className="hidden md:flex rounded-full bg-snak-pink hover:bg-snak-pink/90 text-white font-bold px-4 h-11 border-none shadow-[0_0_20px_rgba(191,15,180,0.3)] transition-all">
                                    <a href="/download-apk">
                                        <Smartphone className="size-4" />
                                        <span>Download for Android</span>
                                    </a>
                                </Button>
                                <TabsList className="bg-snak-purple-medium/30 border border-white/10 p-1 h-11 rounded-full overflow-x-auto no-scrollbar max-w-full flex justify-start sm:justify-center">
                                    <TabsTrigger
                                        value="watch"
                                        className="rounded-full px-6 data-[state=active]:bg-snak-pink data-[state=active]:text-white transition-all whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-2">
                                            <PlayCircle className="size-4" />
                                            <span>Watch</span>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="favorites"
                                        className="rounded-full px-6 data-[state=active]:bg-snak-pink data-[state=active]:text-white transition-all whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Heart className="size-4" />
                                            <span>Favorites</span>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="play"
                                        className="rounded-full px-6 data-[state=active]:bg-snak-pink data-[state=active]:text-white transition-all whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Gamepad2 className="size-4" />
                                            <span>Play</span>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="trade"
                                        className="rounded-full px-6 data-[state=active]:bg-snak-pink data-[state=active]:text-white transition-all whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-2">
                                            <CircleDollarSign className="size-4" />
                                            <span>Trade</span>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="hang"
                                        className="rounded-full px-6 data-[state=active]:bg-snak-pink data-[state=active]:text-white transition-all whitespace-nowrap"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="size-4" />
                                            <span>Hang</span>
                                        </div>
                                    </TabsTrigger>
                                </TabsList>

                                {/* Tokens Balance (Desktop) */}
                                <div className="hidden sm:flex items-center gap-2 bg-snak-pink/10 border border-snak-pink/20 px-4 py-2 rounded-full hover:bg-snak-pink/20 transition-all cursor-default group shadow-[0_0_20px_rgba(191,15,180,0.1)]">
                                    <div className="size-6 rounded-full bg-snak-pink flex items-center justify-center shadow-lg shadow-snak-pink/20">
                                        <Coins className="size-3.5 text-white group-hover:rotate-12 transition-transform" />
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Tu Saldo</span>
                                        {isUserLoading ? (
                                            <Loader2 className="size-3 animate-spin text-snak-pink mt-1" />
                                        ) : (
                                            <span className="text-sm font-black text-white">{userData?.tokens || 0}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row: Filters */}
                        {(activeTab === 'watch' || activeTab === 'favorites') && (
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full animate-in fade-in slide-in-from-top-2 duration-300">
                                {/* Input de Búsqueda */}
                                <div className="relative flex-1 w-full group">
                                    <button
                                        className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
                                        title="Buscar"
                                    >
                                        <Search className="size-4 text-zinc-500 group-focus-within:text-snak-pink transition-colors" />
                                    </button>
                                    <Input
                                        placeholder="Buscar por título..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-10 bg-snak-purple-medium/20 border-white/10 focus:border-snak-pink/50 focus:ring-snak-pink/20 transition-all rounded-full h-11"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                                        >
                                            <X className="size-3 text-zinc-400" />
                                        </button>
                                    )}
                                </div>

                                {/* Select de Categoría */}
                                <div className="w-full sm:w-48">
                                    <Select
                                        value={selectedCategoryId}
                                        onValueChange={setSelectedCategoryId}
                                    >
                                        <SelectTrigger className="bg-snak-purple-medium/20 border-white/10 rounded-full h-11 focus:ring-snak-pink/20">
                                            <div className="flex items-center gap-2">
                                                <Filter className="size-3 text-snak-blue-sky" />
                                                <SelectValue placeholder="Categoría" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-snak-purple-dark border-white/10 text-white">
                                            <SelectItem value="all" className="focus:bg-snak-pink focus:text-white">Todas</SelectItem>
                                            {categories.map((cat) => (
                                                <SelectItem
                                                    key={cat.id}
                                                    value={cat.name.toString()}
                                                    className="focus:bg-snak-pink focus:text-white"
                                                >
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Botón Reset */}
                                {(searchQuery.length > 0 || selectedCategoryId !== '') && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedCategoryId('');
                                            queryClient.resetQueries({ queryKey: ['search-videos'] });
                                        }}
                                        className="text-xs text-snak-pink hover:text-white transition-colors font-bold uppercase tracking-wider px-2"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                <TabsContent value="watch" className="mt-0 outline-none">
                    <div className="max-w-[1440px] mx-auto p-4 md:p-12 space-y-16">
                        {isFiltering ? (
                            <VideosFiltered
                                series={seriesData}
                                searchQuery={searchQuery}
                                selectedCategoryId={selectedCategoryId === 'all' ? undefined : selectedCategoryId}
                                apiSearchResults={searchResults}
                                onEpisodeClick={handleEpisodeClick}
                            />
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="favorites" className="mt-0 outline-none">
                    <FavoriteScreen />
                </TabsContent>

                <TabsContent value="play" className="mt-0 outline-none w-full">
                    <ComingSoon />
                </TabsContent>

                <TabsContent value="trade" className="mt-0 outline-none w-full">
                    <ComingSoon />
                </TabsContent>

                <TabsContent value="hang" className="mt-0 outline-none w-full">
                    <ComingSoon />
                </TabsContent>
            </Tabs>

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