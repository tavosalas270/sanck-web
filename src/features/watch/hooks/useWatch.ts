import { useInfiniteQuery } from '@tanstack/react-query';
import { Videos, Series } from '../schemas';
import { getVideos, getSeries } from '../services';

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