'use server';

import { fetchApi } from '../../../utils';
import { Videos, Series } from '../schemas';

export const getSeries = async (page: number = 1): Promise<Series[]> => {
    const response = await fetchApi(`/api/series/?page=${page}`, 'GET');

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