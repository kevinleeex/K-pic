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
    </div>
</template>

<script>
  import NormalSetting from './NormalSetting'
  import ServerSetting from './ServerSetting'

  export default {
    name: 'setting-page',
    components: {NormalSetting, ServerSetting},
    mounted () {
    },
    data () {
      return {
        activeIndex: '1'
      }
    }
  }
</script>

<style scoped>

</style>
