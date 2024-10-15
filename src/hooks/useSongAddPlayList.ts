import type { songType, MusicItemType } from '@/hooks/methods/songFormat.ts'
import useSongFormat from '@/hooks/methods/songFormat.ts'
import usePlayStore from '@/stores/modules/play.ts'
import { toRawType } from '@/utils/tool';
import { ref, computed } from 'vue';

/**
 * 
 * @param songs 歌曲数据
 * @param options.clear 是否清空播放列表
 */
function useSongAddPlaylist(songs: songType[] | songType,
    options?: {clear: boolean}
): void{
    const playStore = usePlayStore()

    if (toRawType(songs) !== 'Object' && toRawType(songs) !== 'Array') {
        throw new Error('添加的歌曲数据类型错误!');
    }

    const musicList = ref<MusicItemType[]>([]);
    if(toRawType(songs) === 'Object'){
        const musicItem: MusicItemType = useSongFormat(songs as songType);
        musicList.value.push(musicItem);
    }
    if(toRawType(songs) === 'Array' && songs instanceof Array){
        songs.forEach((item: songType) => {
            const musicItem: MusicItemType = useSongFormat(item as songType);
            musicList.value.push(musicItem);
        })
    }

    if (options?.clear) {
        playStore.setPlaySongList(musicList.value)
        return;
    }

    // 获取当前播放列表
    const songPlaylist = computed<MusicItemType[]>(() => playStore.getplaySongList);

    // 去重
    const setMusicList = musicList.value.filter(item => !songPlaylist.value.find(v => v.id === item.id));

    playStore.setPlaySongList([
        ...songPlaylist.value,
        ...setMusicList,
    ])
}

export default useSongAddPlaylist;