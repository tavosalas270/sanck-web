export interface Videos {
    id: number;
    title: string;
    description: string;
    season_number: number;
    episode_number: number;
    video_path: string;
    thumbnail_path: string;
    created_at: Date;
}

export interface Series {
    id: number;
    title: string;
    category: number;
    poster: string;
    videos: Videos[];
}