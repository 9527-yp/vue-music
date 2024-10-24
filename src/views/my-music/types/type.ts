export type SongSheetList = {
    name: string,
    subscribed: boolean,
    id: number,
    coverImgUrl: string,
    trackCount: number,
    creator: {
        nickname: string,
        userId: number,
        avatarUrl: string
    }
}
export type typeSongSheet = {
    createdSongSheet: SongSheetList[],
    collectSongSheet: SongSheetList[],
}

export type songSheetDetail = {
    playlist: {
        coverImgUrl?: string,
        name?: string,
        id?: number,
        playCount?: number,
        trackCount?: number,
        subscribed?: boolean,
        tracks?: {
            id: number;
        }[];
    },
    privileges: {
        id: number;
    }[];
}