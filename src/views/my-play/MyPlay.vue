<template>
    <Teleport to="body">
        <div class="g-btmbar">
        <div class="m-playbar" :class="lock ? 'm-playbar-block' : 'm-playbar-unlock'">
            <div class="updn">
                <div class="left">
                    <i class="left-icon" :class="lock ? 'icon-block' : 'icon-unlock'" @click="handelLock"></i>
                </div>
                <div class="right"></div>
            </div>
            <div class="bg"></div>
            <div class="hand"></div>
            <div class="wrap">
              <div class="btns">
                <i class="prev" title="上一首"></i>
                <i class="play" title="播放/暂停"></i>
                <i class="nxt" title="下一首"></i>
              </div>
              <div class="head">
                <img class="song-img" src="" alt="">
                <i class="mask"></i>
              </div>
              <div class="play">
                <div class="words">
                  <span class="song song-name">卧室假日(Bedroom Holiday)</span>
                  <span class="song song-sing">橘子海 (Orange Ocean)</span>
                  <i class="src" title="来自榜单"></i>
                </div>
                <div class="play-status-box">
                  <div class="bag">
                    <!-- 缓存 -->
                    <div class="rdy"></div>
                    <!-- 播放进度 -->
                    <div class="cur">
                      <span @mousedown="mousedown" class="status-icon">
                        <i class="icon"></i>
                      </span>
                    </div>
                  </div>
                  <span class="time">
                    <em>00:21</em>
                    / 03:33
                  </span>
                </div>
              </div>
              <div class="oper">
                <i class="icn icn-pip" title="画中画歌词"></i>
                <i class="icn icn-add" title="收藏"></i>
                <i class="icn icn-share" title="分享"></i>
              </div>
              <div class="ctrl">
                <!-- 音量调节 -->
                <div class="m-vol">
                  <div class="barbg"></div>
                  <div class="vbg">
                    <div class="curr"></div>
                    <i class="btn"></i>
                  </div>
                </div>
                <i class="icn icn-vol"></i>
                <i class="icn icn-one"></i>
                <span class="add">
                  <span class="tip">已添加到播放列表</span>
                  <i class="icn icn-list">1</i>
                  <i class="icn icn-audioquality"></i>
                </span>
              </div>
            </div>
        </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const lock = ref<boolean>(false)

    function handelLock() {
    lock.value = !lock.value;
    }

    function mousedown(e) {
      console.log('鼠标按下')
    }
</script>

<style lang="scss" scoped>
.g-btmbar{
  position: fixed;
  zoom: 1;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  width: 100%;
  z-index: 1002;
  .m-playbar{
    position: absolute;
    zoom: 1;
    top: -10px;
    left: 0;
    width: 100%;
    height: 53px;
    margin: 0 auto;
    transition: all 0.5s;
    .bg{
      height: 53px;
      zoom: 1;
      margin-right: 67px;
      background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
      background-position: 0 0;
      background-repeat: repeat-x;
    }
    .hand{
      position: absolute;
      top: -10px;
      width: 100%;
      height: 20px;
      cursor: pointer;
    }
    .updn{
      position: relative;
      z-index: 11;
      .left{
        float: left;
        position: absolute;
        top: -14px;
        right: 15px;
        width: 52px;
        height: 67px;
        background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        background-position: 0 -380px;
        .left-icon{
          display: block;
          width: 18px;
          height: 18px;
          margin: 6px 0 0 17px;
          background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
          cursor: pointer;
        }
        .icon-unlock{
          background-position: -80px -380px;
          &:hover{
            background-position: -80px -400px;
          }
        }
        .icon-block{
          background-position: -100px -380px;
          &:hover{
            background-position: -100px -400px;
          }
        }
      }
      .right{
        float: left;
        position: absolute;
        top: -1px;
        right: 0;
        width: 15px;
        height: 54px;
        background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        background-position: -52px -393px;
        pointer-events: none;
      }
    }
    .wrap{
      width: 1030px;
      height: 47px;
      position: absolute;
      top: 6px;
      left: 50%;
      margin-left: -515px;
      z-index: 15;
      .btns{
        width: 137px;
        padding-top: 6px;
        float: left;
        i{
          display: block;
          float: left;
          width: 28px;
          height: 28px;
          margin-right: 8px;
          margin-top: 5px;
          text-indent: -9999px;
          background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        }
        .prev{
          background-position: 0 -130px;
          &:hover{
            background-position: -30px -130px;
          }
        }
        .play{
          width: 36px;
          height: 36px;
          margin-top: 0;
          background-position: 0 -204px;
          &:hover{
            background-position: -40px -204px;
          }
        }
        .nxt{
          background-position: -80px -130px;
          &:hover{
            background-position: -110px -130px;
          }
        }
      }
      .head{
        position: relative;
        margin: 6px 15px 0 0;
        width: 34px;
        height: 34px;
        float: left;
        .song-img{
          width: 34px;
          height: 34px;
        }
        .mask{
          position: absolute;
          top: 0px;
          left: 0px;
          display: block;
          width: 34px;
          height: 35px;
          background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
          background-position: 0 -80px;
        }
      }
      .play{
        width: 581px;
        position: relative;
        float: left;
        .words{
          height: 28px;
          overflow: hidden;
          color: #e8e8e8;
          text-shadow: 0 1px 0 #171717;
          line-height: 28px;
          .song{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
            float: left;
            cursor: pointer;
            &:hover{
              text-decoration: underline;
            }
          }
          .song-name{
            max-width: 300px;
            color: #e8e8e8;
          }
          .song-sing{
            max-width: 220px;
            margin-left: 15px;
            color: #9b9b9b;
          }
          .src{
            float: left;
            width: 14px;
            height: 15px;
            margin: 7px 0 0 13px;
            background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
            background-position: -110px -103px;
            &:hover{
              background-position: -130px -103px;
            }
          }
        }
        .play-status-box{
          width: 466px;
          position: relative;
          .bag{
            width: 466px;
            height: 9px;
            background: url('@/assets/images/play/statbar.png') no-repeat 0 9999px;
            background-position: right 0;
            .rdy{
              height: 9px;
              background: url('@/assets/images/play/statbar.png') no-repeat 0 9999px;
              background-position: right 0;
            }
            .cur{
              position: absolute;
              top: 0;
              left: 0;
              width: 9%;
              height: 9px;
              background: url('@/assets/images/play/statbar.png') no-repeat 0 9999px;
              background-position: left -66px;
              .status-icon{
                position: absolute;
                top: -7px;
                right: -13px;
                width: 22px;
                height: 24px;
                margin-left: -11px;
                background: url('@/assets/images/play/iconall.png') no-repeat 0 9999px;
                background-position: 0 -250px;
                cursor: pointer;
                .icon{
                  position: absolute;
                  left: 5px;
                  top: 5px;
                  width: 12px;
                  height: 12px;
                  background: url('@/assets/images/play/loading.gif');
                }
              }
            }
          }
          .time{
            position: absolute;
            top: -5px;
            right: -84px;
            color: #797979;
            text-shadow: 0 1px 0 #121212;
            em{
              color: #a1a1a1;
            }
          }
        }
      }
      .oper{
        width: 87px;
        float: left;
        .icn{
          float: left;
          width: 25px;
          height: 25px;
          margin: 11px 2px 0 0;
          text-indent: -9999px;
          background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        }
        .icn-pip{
          position: relative;
          background: url('@/assets/images/play/icn-pip.png') no-repeat 0 0;
          &:hover{
            background-position-y: -25px;
          }
        }
        .icn-add{
          background-position: -88px -163px;
          &:hover{
            background-position: -88px -189px;
          }
        }
        .icn-share{
          background-position: -114px -163px;
          &:hover{
            background-position: -114px -189px;
          }
        }
      }
      .ctrl{
        position: relative;
        z-index: 10;
        width: 160px;
        padding-left: 13px;
        background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        background-position: -147px -238px;
        float: left;
        .m-vol{
          position: absolute;
          top: -113px;
          left: 9px;
          clear: both;
          width: 32px;
          height: 113px;
          .barbg{
            position: absolute;
            top: 0;
            left: 0;
            width: 32px;
            height: 113px;
            background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
            background-position: 0 -503px;
          }
          .vbg{
            position: absolute;
            left: 14px;
            width: 4px;
            height: 93px;
            padding: 4px 0;
            top: 7px;
            .curr{
              height: 74.4px;
              width: 4px;
              position: absolute;
              top: auto;
              bottom: 4px;
              left: 0;
              background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
              background-position: -40px bottom;
              overflow: hidden;
            }
            .btn{
              position: absolute;
              top: 16.2px;
              left: -7px;
              display: block;
              width: 18px;
              height: 20px;
              background: url('@/assets/images/play/iconall.png') no-repeat 0 9999px;
              background-position: -40px -250px;
              cursor: pointer;
            }
          }
        }
        .icn{
          float: left;
          width: 25px;
          height: 25px;
          margin: 11px 2px 0 0;
          text-indent: -9999px;
          background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        }
        .icn-vol{
          background-position: -2px -248px;
          &:hover{
            background-position: -31px -248px;
          }
        }
        .icn-one{
          background-position: -66px -344px;
          &:hover{
            background-position: -93px -344px;
          }
        }
        .icn-loop{
          background-position: -3px -344px;
          &:hover{
            background-position: -33px -344px;
          }
        }
        .icn-shuffle{
          background-position: -66px -248px;
          &:hover{
            background-position: -93px -248px;
          }
        }
        .add{
          float: left;
          width: 59px;
          height: 36px;
          position: relative;
          zoom: 1;
          .tip{
            display: none;
            position: absolute;
            top: -51px;
            left: -65px;
            clear: both;
            width: 152px;
            height: 49px;
            background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
            background-position: 0 -287px;
            text-align: center;
            color: #fff;
            line-height: 37px;
          }
          .icn-list{
            display: block;
            float: none;
            width: 38px;
            padding-left: 21px;
            background-position: -42px -68px;
            line-height: 27px;
            text-align: center;
            color: #666;
            text-shadow: 0 1px 0 #080707;
            text-indent: 0;
            text-decoration: none;
            &:hover{
              background-position: -42px -98px;
              text-decoration: none;
            }
          }
          .icn-audioquality{
            background: url('@/assets/images/play/audio-quality.png');
            background-size: 45px 30px;
            margin-left: 4px;
            width: 41px;
            margin-top: 9px;
            &:hover{
              background: url('@/assets/images/play/audio-quality-hover.png');
            }
          }
        }
      }
    }
  }
  .m-playbar-unlock:hover{
    top: -53px;
  }
  .m-playbar-block{
    top: -53px;
  }
}
</style>