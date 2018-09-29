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
                <keep-alive>
                    <transition name="el-fade-in-linear">
                        <normal-setting v-if="activeIndex==='1'"></normal-setting>
                        <server-setting v-if="activeIndex==='2'"></server-setting>
                    </transition>
                </keep-alive>
            </el-main>
        </el-container>
        <div class="footer">
            <div class="btn_group">
                <el-button @click="closeSet">{{$t('m.cancel')}}</el-button>
                <el-button @click="confirmSet" type="primary">{{$t('m.confirm')}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
  import NormalSetting from './NormalSetting'
  import ServerSetting from './ServerSetting'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'SettingPage',
    components: {NormalSetting, ServerSetting},
    mounted () {
    },
    data () {
      return {
        activeIndex: '1'
      }
    },
    computed: {
      ...mapGetters({settingStatus: 'getSettingWinStatus'})
    },
    methods: {
      handleSelect (key, keyPath) {
        this.activeIndex = key
      },
      closeSet () {
        console.info(this.settingStatus)
        this.toggleSettingWin(false)
      },
      confirmSet () {
        console.info('confirm')
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
