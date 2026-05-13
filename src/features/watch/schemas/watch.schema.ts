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
    is_unlocked: boolean;
    is_favorite?: boolean;
    likes_count: number;
    user_has_liked: boolean;
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

export interface UserTokenData {
    id: string;
    username: string;
    email: string;
    tokens: number;
    created_at: Date;
}

export interface AddFavoriteResponse {
    message: string;
    is_favorite: boolean;
    data: Videos;
}