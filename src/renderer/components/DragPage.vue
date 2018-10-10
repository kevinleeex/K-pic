<template>
    <div id="wrapper">
        <main>
            <div class="head_bar"></div>
            <div class="title_container no_drag">
                <div class="app_title" @click="open('http:lidengju.com')">K-Pic</div>
            </div>
            <div @dragleave="dragLeave" @mouseleave="dragLeave" @dragover="dragOver" @drop="drop2upload" id="drag_area"
                 class="drag_area no_drag">
                <div class="drag_container"><img class="drag_img" src="../assets/icons/drag_img.svg"></div>
                <div class="drag_text"><p>{{dragTips}}</p></div>
            </div>
            <div class="server_info note_text"><b><span>{{$t('m.workWith')}}</span>: </b><span
                    :class="{'error': (currentServer.name==='')}">{{(currentServer.name==='')?$t('m.tips.unset'):currentServer.name}}</span>
            </div>
            <div id="back_container" class="no_drag">
                <el-button class="btn_back" :type="signType" :disabled="btnActive" round>{{signal}}</el-button>
            </div>
            <div class="btn_panel">
                <el-row :gutter="20">
                    <el-col class="item item_scale" :span="12"><img class="item-img" src="../assets/icons/shape.svg">
                        <el-select class="set_button scale_button" v-model="scale" placeholder="--">
                            <el-option
                                    v-for="item in options"
                                    :key="item.key"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col class="item item_scale" :span="12"><img class="item-img" src="../assets/icons/history.svg">
                        <el-button class="set_button history_button">{{$t('m.history')}}</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="btn_panel">
                <el-row>
                    <el-col class="item item_scale" :span="24"><img class="item-img"
                                                                    src="../assets/icons/markdown.svg">
                        <el-switch v-model="isMarkdown"
                                   active-color="#13ce66"
                                   inactive-color="#ff4949"></el-switch>
                    </el-col>
                </el-row>
            </div>
        </main>
        <div class="footer">
            <div class="btn" @click="setting"><img src="../assets/icons/setting.svg"></div>
            <div class="btn" @click="dialogVisible = true"><img src="../assets/icons/info.svg"></div>
        </div>
        <el-dialog
                title=""
                :visible.sync="dialogVisible"
                width="60%">
            <el-container>
                <el-header>
                    <div class="info_title_container">
                        <div class="info_title" @click="open('http:lidengju.com')"><p>K-Pic</p></div>
                        <div class="version"><p><span>{{$t('m.version')}}:</span> <span>{{$t('m.vno')}}</span></p></div>
                        <div class="intro"><p>{{$t('m.intro')}}</p></div>
                    </div>

                </el-header>
                <el-main>
                    <div class="lil_title animated bounce delay-1s">
                        {{$t('m.power')}}
                    </div>
                    <ul>
                        <li v-for="item in stack">
                            <div class="stack_item" @click="open(item.i_url)">{{item.i_name}}</div>
                        </li>
                    </ul>
                </el-main>
                <el-footer class="info_footer">
                    <p>©2018 | <span class="name"
                                     @click="open('http://lidengju.com/blog/about')">{{$t('m.author')}}.</span>{{$t('m.copyright')}}.
                    </p>
                </el-footer>
            </el-container>
        </el-dialog>
    </div>
</template>

<script>
  /* eslint-disable no-unused-vars */

  import {mapGetters, mapActions} from 'vuex'
  import {sender, reciever} from '../utils/pipeline'
  import {local} from '../utils/storage'
  export default {
    name: 'drag-page',
    components: {},
    data () {
      return {
        isMarkdown: true,
        upStatus: 'resting',
        signType: '',
        dragTips: '',
        btnActive: true,
        dialogVisible: false,
        options: [{
          value: '0',
          label: '',
          disabled: true
        }, {
          value: '1',
          label: '100%'
        }, {
          value: '0.75',
          label: '75%'
        }, {
          value: '0.5',
          label: '50%'
        }, {
          value: '0.25',
          label: '25%'
        }],
        scale: '1',
        stack: [{i_name: 'Electron', i_url: 'https://electronjs.org/'}, {
          i_name: 'Vue.js',
          i_url: 'https://vuejs.org/'
        }, {i_name: 'Electron-Vue', i_url: 'https://github.com/SimulatedGREG/electron-vue'}, {
          i_name: 'Vue-CLI',
          i_url: 'https://cli.vuejs.org/'
        }, {i_name: 'Electron-json-storage', i_url: 'https://github.com/electron-userland/electron-json-storage'}, {
          i_name: 'Vue Router',
          i_url: 'https://router.vuejs.org/'
        }, {i_name: 'Vuex', i_url: 'https://vuex.vuejs.org/'}, {
          i_name: 'Element-UI',
          i_url: 'https://element.eleme.io/'
        }]
      }
    },
    watch: {
      isMarkdown: function () {
        (this.isMarkdown) ? this.$message({
          message: this.$t('m.tips.markOn'),
          center: true
        }) : this.$message({message: this.$t('m.tips.markOff'), center: true})
      }
    },
    computed: {
      ...mapGetters(['getCurServer']),
      signal: function () {
        let sign = ''
        switch (this.upStatus) {
          case 'resting':
            sign = this.$t('m.tips.resting')
            this.signType = 'success'
            break
          case 'uploading':
            sign = this.$t('m.tips.uploading')
            this.signType = 'warning'
            break
          case 'rollback':
            sign = this.$t('m.tips.rollback')
            this.signType = 'danger'
            break
        }
        return sign
      },
      currentServer: function () {
        return this.getCurServer
      }
    },
    methods: {
      ...mapActions([
        'toggleSettingWin', 'setConfig']),
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      setting () {
        this.toggleSettingWin(true)
      },
      drop2upload (event) {
        event.preventDefault()
        event.stopPropagation()
        if (this.currentServer.name === '' || this.currentServer.name === undefined) {
          this.$notify({
            title: this.$t('m.tips.warning'),
            message: this.$t('m.tips.unsetConfig'),
            duration: 2000,
            type: 'warning'
          })
          return
        }
        let files = event.dataTransfer.files
        let fileList = []
        for (let f of files) {
          console.info('File(s) you dragged to here', f.path)
          const singleFile = {timestamp: new Date().getTime(), path: f.path}
          fileList.push(singleFile)
        }
        let upData = {
          serverInfo: this.currentServer,
          filesInfo: fileList,
          settingInfo: {scale: this.scale, isMarkdown: this.isMarkdown}
        }
        sender.upload(upData)
        this.upStatus = 'uploading'
        reciever.resUpload((data) => {
          console.info('data: ' + JSON.stringify(data.data))
          if (data.data.code === 200) {
            this.upStatus = 'resting'
            const notification = {
              title: this.$t('m.tips.upSucceed'),
              body: data.data.fileInfo.srcFileName + ' ' + this.$t('m.tips.upload2') + ' ' + data.data.serverInfo.name
            }
            const notificationButton = document.getElementById('basic-noti')
            const myNotification = new window.Notification(notification.title, notification)
          }
        })
      },
      dragOver (event) {
        event.preventDefault()
        event.stopPropagation()
        this.dragTips = this.$t('m.tips.drop')
      },
      dragLeave (event) {
        event.preventDefault()
        event.stopPropagation()
        this.dragTips = this.$t('m.tips.drag')
      }
    },
    mounted: function () {
      sender.loadConfig()
      reciever.getConfig((data) => {
        console.info('data: ' + JSON.stringify(data.data))
        if (!data['state']) {
          this.$notify({
            title: this.$t('m.tips.warning'),
            message: this.$t('m.tips.unsetConfig'),
            duration: 2000,
            type: 'warning'
          })
        } else {
          // this.$i18n.locale = data.data.commonSet.language
          this.$i18n.locale = local.getItem('lang')
          this.setConfig(data['data'])
        }
      })
      this.dragTips = this.$t('m.tips.drag')
      this.options[0].label = this.$t('m.scale')
    }
  }
</script>

<style lang="scss">


    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Lato', 'Helvetica Neue', Arial, sans-serif;
    }

    ul {
        list-style: none;
        font-size: 12px;
    }

    li.is-disabled:hover {
        cursor: default;
    }

    .error {
        color: #b6182c;
    }

    .server_info {
        text-align: center;
        width: 100%;
        display: inline-block;
    }

    .note_text {
        color: #666666;
        font-size: small;
    }

    .el-dialog__body {
        padding: 10px 0px !important;
    }

    .info_footer {
        font-size: 10px;
        color: #888a8d;
        height: 20px !important;
    }

    .info_footer .name:hover {
        cursor: pointer;
        color: #95dafc;
    }

    .stack_item {
        line-height: 20px;
        transition-duration: 100ms;
        height: 20px;
        color: #888888;
    }

    .stack_item:hover {
        color: azure;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.50);
        transition-duration: 100ms;
        cursor: default;
        background-color: rgba(68, 180, 170, 0.48);
    }

    .intro {
        font-size: 12px;
        font-weight: bold;
    }

    .el-header {
        padding: 0 !important;
    }

    .lil_title {
        color: #2abf88;
        font-weight: bold;
        font-size: 14px;
    }

    .el-container {
        text-align: center;
    }

    .version {
        color: #888888;
        font-size: 12px;
        font-family: 'Helvetica Neue', Arial, sans-serif;
        align-items: center;
        justify-content: center;
    }

    .info_title_container {
        justify-content: center;
        align-items: center;
    }

    .info_title {
        text-align: center;
        font-size: 30px;
        font-family: Marion-Bold, serif;
        color: #474747;
        letter-spacing: 0;
        text-shadow: 0 3px 2px rgba(0, 0, 0, 0.50);
    }

    .info_title:hover {
        cursor: pointer;
    }

    .footer {
        position: absolute;
        bottom: 1%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btn {
        width: 30px;
        height: 30px;
        display: flex;
        margin: 10px;
        justify-content: center;
    }

    .btn:hover {
        cursor: pointer;
        background: rgba(200, 200, 200, 0.6);
    }

    .scale_button input {
        width: 100px;
        height: 40px;
        font-weight: bold;
        background: #F2F2F2;
        box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.50);
        border-radius: 3px;
    }

    .scale_button div {
        background: #F2F2F2;
        box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.50);
        border-radius: 3px;
    }

    .history_button {
        width: 100px;
        height: 40px;
        display: flex;
        align-items: center;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .item-img {
        height: 20px;
        margin-right: 10px;
        align-items: center;
    }

    .set_button {
        color: black;
        background: #F2F2F2;
        box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.50);
        border-radius: 3px;
    }

    .btn_panel {
        margin: 20px;
    }

    #back_container {
        margin-top: 10px;
        text-align: center;
        justify-content: center;
    }

    .drag_text {
        margin-top: 10px;
        text-align: center;
        font-family: Marion-Bold, 'Lato', 'Helvetica Neue', Arial, sans-serif;
        font-size: 20px;
        color: #898989;
        letter-spacing: 0;
    }

    .head_bar {
        height: 20px;
        width: 100vw;
        background-image: linear-gradient(-180deg, #98DCF0 3%, #67CDD4 99%);
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.50);
        border-radius: 8px 8px 0 0;
    }

    .title_container {
        display: flex;
        justify-content: center;
    }

    .app_title {
        display: inline-block;
        width: fit-content;
        font-family: Marion-Bold, serif;
        font-size: 40px;
        color: #474747;
        letter-spacing: 0;
        text-shadow: 0 3px 2px rgba(0, 0, 0, 0.50);
        margin-top: 16px;
        text-align: center;
    }

    .app_title:hover {
        cursor: pointer;
    }

    #drag_area {
        height: 160px;
        margin: 0px 20px;
        background: #F3F3F3;
        box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.50);
    }

    .drag_container {
        text-align: center;
    }

    .drag_img {
        display: inline-block;
        margin-top: 16px;
        width: 90px;
    }

    #wrapper {
        background: radial-gradient(
                        ellipse at top,
                        rgba(255, 255, 255, 1) 40%,
                        rgba(229, 229, 229, .9) 100%
        );
        height: 100vh;
        width: 100vw;
    }

    .no_drag {
        -webkit-app-region: no-drag !important;
    }
</style>
