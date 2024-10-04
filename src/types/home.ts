export type SongType = {
    id: number;
    name: string;
    album?: {
        picUrl: string;
    };
    al?: {
        picUrl: string;
    };
    radio?: {
        picUrl: string;
    };
    img80x80?: string;
    picUrl?: string;
    dt?: number;
    duration?: number;
    mv?: number;
    artists?: {
        id: number;
        name: string;
    }[];
    ar?: {
        id: number;
        name: string;
    }[];
}