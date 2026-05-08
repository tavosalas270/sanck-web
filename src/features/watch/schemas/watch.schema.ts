export interface Videos {
    id: number;
    title: string;
    description: string;
    serie_id?: number;
    serie_name?: string;
    season_number: number;
    episode_number: number;
    video_file?: string;
    thumbnail?: string;
    video_path: string;
    thumbnail_path: string;
    category_id?: number;
    category_name?: string;
    user_id?: number;
    username?: string;
    created_at: Date;
    cost: number;
}

export interface Series {
    id: number;
    title: string;
    category: number;
    poster: string;
    videos: Videos[];
}

export interface Categories {
    id: number;
    name: string;
}

export interface Favorites {
    id: string;
    video: string;
    video_details: Videos;
    created_at: Date;
}