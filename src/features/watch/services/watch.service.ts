'use server';

import { fetchApi } from '../../../utils';
import { Videos, Series, Categories, Favorites, UserTokenData } from '../schemas';

export const getSeries = async (page: number = 1): Promise<Series[]> => {
    const response = await fetchApi(`/api/series/?page=${page}`, 'GET');

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const getFavorites = async (page: number = 1): Promise<Favorites[]> => {
    const response = await fetchApi(`/api/favorites/?page=${page}`, 'GET');

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const addFavorite = async (videoId: string): Promise<any> => {
    const response = await fetchApi('/api/favorites/', 'POST', {
        body: JSON.stringify({ video: videoId })
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const getCategories = async (): Promise<Categories[]> => {
    const response = await fetchApi('/api/categories/', 'GET');

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const getVideos = async (page: number = 1, serie: number): Promise<Videos[]> => {
    const response = await fetchApi(`/api/videos/?page=${page}&serie=${serie}`, 'GET');

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const postSearchVideos = async (query?: string, category?: string): Promise<Videos[]> => {
    let url = '/api/videos/?';
    if (query) {
        url += `search=${encodeURIComponent(query)}&`;
    }
    if (category) {
        url += `category=${encodeURIComponent(category)}`;
    }

    const response = await fetchApi(url, 'GET');

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const postPayVideo = async (videoId: string): Promise<any> => {
    const response = await fetchApi(`/api/videos/${videoId}/unlock/`, 'POST');

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const getUserData = async (): Promise<UserTokenData> => {
    const response = await fetchApi('/api/users/me/', 'GET');

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const getMyPurchases = async (): Promise<Videos[]> => {
    const response = await fetchApi('/api/videos/my-purchases/', 'GET');

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    console.log(data)
    return data;
};