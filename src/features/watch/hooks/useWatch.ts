import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Videos, Series, Categories, Favorites } from '../schemas';
import { 
    getVideos, 
    getSeries, 
    getCategories, 
    getFavorites, 
    addFavorite,
    getUserData,
    getMyPurchases,
    postPayVideo
} from '../services';

export const usePayVideo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postPayVideo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-data'] });
            queryClient.invalidateQueries({ queryKey: ['my-purchases'] });
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
        onSuccess: (newFavorite) => {
            queryClient.setQueryData(['favorites'], (oldData: any) => {
                if (!oldData) return {
                    pages: [[newFavorite]],
                    pageParams: [1]
                };

                return {
                    ...oldData,
                    pages: [
                        [newFavorite, ...oldData.pages[0]],
                        ...oldData.pages.slice(1)
                    ]
                };
            });
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