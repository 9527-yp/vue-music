export type TypeSongSheetList = {
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
export type TypeSongSheet = {
    createdSongSheet: TypeSongSheetList[],
    collectSongSheet: TypeSongSheetList[],
}

export type SongSheetDetail = {
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