import { useInfiniteQuery, useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Videos, Series, Categories, Favorites, LikeVideoResponse, PostComment, Comments } from '../schemas';
import {
    getVideos,
    getSeries,
    getCategories,
    getFavorites,
    addFavorite,
    getUserData,
    getMyPurchases,
    postPayVideo,
    postSearchVideos,
    postLikeVideo,
    getComments,
    postCommentService,
    getPlayVideo
} from '../services';

export const usePayVideo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postPayVideo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-data'] });
            queryClient.invalidateQueries({ queryKey: ['my-purchases'] });
            queryClient.invalidateQueries({ queryKey: ['series'] });
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['videos'] });
        }
    });
};

export const useUserData = () => {
    return useQuery({
        queryKey: ['user-data'],
        queryFn: getUserData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useMyPurchases = () => {
    return useQuery({
        queryKey: ['my-purchases'],
        queryFn: getMyPurchases,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useSeries = () => {
    const query = useInfiniteQuery({
        queryKey: ['series'],
        initialPageParam: 1,
        queryFn: async ({ pageParam }): Promise<Series[]> => {
            try {
                return await getSeries(pageParam);
            } catch {
                return [];
            }
        },
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (!lastPage || lastPage.length === 0) return undefined;
            return lastPageParam + 1;
        },
    });

    return query;
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useFavorites = () => {
    const query = useInfiniteQuery({
        queryKey: ['favorites'],
        queryFn: ({ pageParam = 1 }) => getFavorites(pageParam),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
    });

    return query;
};

export const useAddFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addFavorite,
        onSuccess: (response, videoId) => {
            const isFav = response.is_favorite;

            // Actualizar caché de series
            queryClient.setQueriesData({ queryKey: ['series'] }, (oldData: any) => {
                if (!oldData?.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: Series[]) =>
                        page.map(serie => ({
                            ...serie,
                            videos: serie.videos.map(v => v.id.toString() === videoId.toString() ? { ...v, is_favorite: isFav } : v)
                        }))
                    )
                };
            });

            // Actualizar caché de videos (paginación)
            queryClient.setQueriesData({ queryKey: ['videos'] }, (oldData: any) => {
                if (!oldData?.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: Videos[]) =>
                        page.map(v => v.id.toString() === videoId.toString() ? { ...v, is_favorite: isFav } : v)
                    )
                };
            });

            // Actualizar caché de search-videos
            queryClient.setQueriesData({ queryKey: ['search-videos'] }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.map((v: Videos) =>
                    v.id.toString() === videoId.toString() ? { ...v, is_favorite: isFav } : v
                );
            });

            // Invalidar queries para mantener sincronización general
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['series'] });
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            queryClient.invalidateQueries({ queryKey: ['search-videos'] });
        }
    });
};

export const useVideos = (serie: number, initialPage: number = 1, enabled: boolean = true) => {
    const query = useInfiniteQuery({
        queryKey: ['videos', serie],
        initialPageParam: initialPage,
        queryFn: async ({ pageParam }): Promise<Videos[]> => {
            try {
                return await getVideos(pageParam as number, serie);
            } catch {
                return [];
            }
        },
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (!lastPage || lastPage.length < 5) return undefined;
            return (lastPageParam as number) + 1;
        },
        enabled,
    });
    return query;
};

export const useSearchVideos = (query?: string, category?: string) => {
    const hasFilters = (query && query.trim().length > 0) || !!category;
    return useQuery({
        queryKey: ['search-videos', query, category],
        queryFn: () => postSearchVideos(query, category),
        enabled: !!hasFilters,
    });
};

export const useLikeVideo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postLikeVideo,
        onSuccess: (response, videoId) => {
            const isLiked = response.status === 'liked';
            const likeDiff = isLiked ? 1 : -1;

            // Actualizar caché de series
            queryClient.setQueriesData({ queryKey: ['series'] }, (oldData: any) => {
                if (!oldData?.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: Series[]) =>
                        page.map(serie => ({
                            ...serie,
                            videos: serie.videos.map(v => {
                                if (v.id.toString() === videoId.toString()) {
                                    // Evitar duplicar la operación si el estado ya coincide
                                    if (v.user_has_liked === isLiked) return v;
                                    return {
                                        ...v,
                                        user_has_liked: isLiked,
                                        likes_count: Math.max(0, (v.likes_count || 0) + likeDiff)
                                    };
                                }
                                return v;
                            })
                        }))
                    )
                };
            });

            // Actualizar caché de videos
            queryClient.setQueriesData({ queryKey: ['videos'] }, (oldData: any) => {
                if (!oldData?.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: Videos[]) =>
                        page.map(v => {
                            if (v.id.toString() === videoId.toString()) {
                                if (v.user_has_liked === isLiked) return v;
                                return {
                                    ...v,
                                    user_has_liked: isLiked,
                                    likes_count: Math.max(0, (v.likes_count || 0) + likeDiff)
                                };
                            }
                            return v;
                        })
                    )
                };
            });

            // Actualizar caché de favoritos
            queryClient.setQueriesData({ queryKey: ['favorites'] }, (oldData: any) => {
                if (!oldData?.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: Favorites[]) =>
                        page.map(fav => {
                            if (fav.video_details?.id.toString() === videoId.toString()) {
                                if (fav.video_details.user_has_liked === isLiked) return fav;
                                return {
                                    ...fav,
                                    video_details: {
                                        ...fav.video_details,
                                        user_has_liked: isLiked,
                                        likes_count: Math.max(0, (fav.video_details.likes_count || 0) + likeDiff)
                                    }
                                };
                            }
                            return fav;
                        })
                    )
                };
            });

            // Actualizar caché de search-videos
            queryClient.setQueriesData({ queryKey: ['search-videos'] }, (oldData: any) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.map((v: Videos) => {
                    if (v.id.toString() === videoId.toString()) {
                        if (v.user_has_liked === isLiked) return v;
                        return {
                            ...v,
                            user_has_liked: isLiked,
                            likes_count: Math.max(0, (v.likes_count || 0) + likeDiff)
                        };
                    }
                    return v;
                });
            });

            queryClient.invalidateQueries({ queryKey: ['series'] });
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['search-videos'] });
        }
    });
};

export const useComments = (videoId: string) => {
    return useQuery({
        queryKey: ['comments', videoId],
        queryFn: () => getComments(videoId),
        enabled: !!videoId,
        select: (data) => {
            if (!data) return [];
            const replyIds = new Set<number>();
            data.forEach(comment => {
                if (comment.replies && Array.isArray(comment.replies)) {
                    comment.replies.forEach(reply => {
                        replyIds.add(reply.id);
                    });
                }
            });
            return data.filter(comment => !replyIds.has(comment.id));
        }
    });
};

export const usePostComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postCommentService,
        onSuccess: (newComment) => {
            const videoId = newComment.video;
            queryClient.setQueryData(['comments', videoId], (oldComments: Comments[] | undefined) => {
                if (!oldComments) return [newComment];

                if (newComment.parent) {
                    return oldComments.map(comment => {
                        if (comment.id === newComment.parent) {
                            return {
                                ...comment,
                                replies_count: (comment.replies_count || 0) + 1,
                                replies: [...(comment.replies || []), newComment]
                            };
                        }
                        return comment;
                    });
                } else {
                    return [newComment, ...oldComments];
                }
            });
            queryClient.invalidateQueries({ queryKey: ['comments', videoId] });
        }
    });
};

export const usePlayVideo = (videoId?: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ['play-video', videoId],
        queryFn: async () => {
            try {
                const response = await getPlayVideo(videoId!);
                console.log('[usePlayVideo] ✅ Success:', response);
                return response;
            } catch (error) {
                console.error('[usePlayVideo] ❌ Error:', error);
                throw error;
            }
        },
        enabled: !!videoId && enabled,
    });
};