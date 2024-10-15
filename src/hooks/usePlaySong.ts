import type { songType } from '@/hooks/methods/songFormat.ts'
import { toRawType } from '@/utils/tool';
import useSongFormat from '@/hooks/methods/songFormat'
import usePlayStore from '@/stores/modules/play.ts'
/**
 * 
 * @param { object } song 歌曲数据
 */
function usePlaySong(song: songType) {
    const playStore = usePlayStore()
    if (toRawType(song) !== 'Object') {
        throw new Error('播放歌曲数据类型错误!');
    }

    const musicItem: {} = useSongFormat(song);

    // 将播放歌曲保存到本地
    playStore.setPlaySong(musicItem)
}

export default usePlaySong;