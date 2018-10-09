<template>
    <div>
        <el-container>
            <el-header>
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">{{$t('m.about')}}</el-menu-item>
                    <el-menu-item index="2">{{$t('m.common')}}</el-menu-item>
                    <el-menu-item index="3">{{$t('m.server')}}</el-menu-item>
                </el-menu>
            </el-header>
            <el-main>

                <transition name="component-fade" mode="out-in">
                    <keep-alive>
                        <component :is="viewName"></component>
                    </keep-alive>
                </transition>

            </el-main>
        </el-container>
        <div class="footer" style="position: fixed; ">
            <div class="btn_group">
                <el-button @click="closeSet" type="info" plain>{{$t('m.cancel')}}</el-button>
                <el-button @click="applySet">{{$t('m.apply')}}</el-button>
                <el-button @click="confirmSet" type="primary">{{$t('m.confirm')}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import NormalSetting from './CommonSetting'
  import ServerSetting from './ServerSetting'
  import About from './About'
  import {mapGetters, mapActions} from 'vuex'
  import {sender, reciever} from '../utils/pipeline'

  export default {
    name: 'SettingPage',
    components: {'about': About, 'common': NormalSetting, 'server': ServerSetting},
    data () {
      return {
        viewName: '',
        activeIndex: '',
        readyStatus: false,
        commonTrans: null
      }
    },
    computed: {
      ...mapGetters(['getSettingWinStatus', 'getCurServer', 'getCommonSet', 'getServerList'])
    },
    mounted: function () {
      this.readConfig()
      this.readyStatus = true
      this.handleSelect('1')
      // alert(JSON.stringify(this.getCommonSet))
    },
    methods: {
      getCurrentServerByName () {
        const sName = this.getCommonSet.workWith
        let currentServer = {}
        for (let ix in this.getServerList) {
          if (sName === this.getServerList[ix].name) {
            currentServer = JSON.parse(JSON.stringify(this.getServerList[ix]))
            break
          }
        }
        return currentServer
      },
      saveConfig2Local () {
        // save the setting as the config file and save in local.
        console.info('Save!!!' + JSON.stringify(this.getCurrentServerByName()))
        this.setCurServer({curServer: this.getCurrentServerByName()})
        let data = {commonSet: this.getCommonSet, curServer: this.getCurServer, serverList: this.getServerList}
        sender.saveConfig(data)
        reciever.resSaveConfig((data) => {
          const notification = {
            title: '',
            body: ''
          }
          if (data['state']) {
            notification.title = this.$t('m.tips.success')
            notification.body = this.$t('m.tips.setConfig')
          } else {
            notification.title = this.$t('m.tips.warning')
            notification.body = this.$t('m.tips.unsetConfig')
          }
          const notificationButton = document.getElementById('basic-noti')
          const myNotification = new window.Notification(notification.title, notification)
        })
      },
      handleSelect (key, keyPath) {
        const viewList = ['about', 'common', 'server']
        this.activeIndex = key
        this.viewName = viewList[key - 1]
      },
      closeSet () {
        console.info(this.settingStatus)
        this.toggleSettingWin(false)
      },
      applySet () {
        console.info('apply')
        this.saveConfig2Local()
        this.readConfig()
      },
      applySet2 (callback) {
        this.saveConfig2Local()
        setTimeout(callback, 200) // set the operation order.
      },
      confirmSet () {
        this.applySet2(this.closeSet)
      },
      readConfig () {
        sender.loadConfig()
        reciever.getConfig((data) => {
          // console.info('data: ' + data['code'])
          if (!data['state']) {
            this.$notify({
              title: this.$t('m.tips.warning'),
              message: this.$t('m.tips.unsetConfig'),
              duration: 2000,
              type: 'warning'
            })
          } else {
            this.setConfig(data['data'])
          }
        })
      },
      ...mapActions(['toggleSettingWin', 'setConfig', 'setCurServer'])
    }
  }
</script>

<style>
    body {
        -webkit-app-region: drag
    }

</style>
