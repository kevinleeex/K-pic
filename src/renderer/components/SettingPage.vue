<template>
    <div>
        <el-container>
            <el-header>
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">{{$t('m.common')}}</el-menu-item>
                    <el-menu-item index="2">{{$t('m.server')}}</el-menu-item>
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
                <el-button @click="closeSet">{{$t('m.cancel')}}</el-button>
                <el-button @click="confirmSet" type="primary">{{$t('m.confirm')}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import NormalSetting from './NormalSetting'
  import ServerSetting from './ServerSetting'
  import {mapGetters, mapActions} from 'vuex'
  import {sender, reciever} from '../utils/pipeline'

  export default {
    name: 'SettingPage',
    components: {'normal': NormalSetting, 'server': ServerSetting},
    data () {
      return {
        viewName: 'normal',
        activeIndex: '1'
      }
    },
    computed: {
      ...mapGetters(['getSettingWinStatus', 'getCurServer', 'getCommonSet', 'getServerList'])
    },
    mounted: function () {
    },
    methods: {
      saveConfig2Local () {
        // save the setting as the config file and save in local.
        console.info('Save!!!')
        let data = {commonSet: this.getCommonSet, curServer: this.getCurServer, serverList: this.getServerList}
        sender.saveConfig(data)
      },
      handleSelect (key, keyPath) {
        const viewList = ['normal', 'server']
        this.activeIndex = key
        this.viewName = viewList[key - 1]
      },
      closeSet () {
        console.info(this.settingStatus)
        this.toggleSettingWin(false)
      },
      confirmSet () {
        console.info('confirm')
        this.saveConfig2Local()
        // this.toggleSettingWin(false)
      },
      ...mapActions(['toggleSettingWin'])
    }
  }
</script>

<style>
    body {
        -webkit-app-region: drag
    }

</style>
