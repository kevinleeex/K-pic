<template>
    <div id="wrapper">
        <main>
            <div class="head_bar"></div>
            <div class="title_container">
                <div class="app_title" @click="open('http:lidengju.com')">K-Pic</div>
            </div>
            <div id="drag_area" class="drag_area">
                <div class="drag_container"><img class="drag_img" src="../assets/icons/drag_img.svg"></div>
                <div class="drag_text"><p>{{$t('m.drag')}}</p></div>
            </div>
            <div id="back_container">
                <el-button class="btn_back" type="danger" :disabled="btnActive" round>{{$t('m.rollback')}}</el-button>
            </div>
            <div class="scale_history">
                <el-row :gutter="20">
                    <el-col class="item item_scale" :span="12"><img class="item-img" src="../assets/icons/shape.svg">
                        <el-select class="set_button scale_button" v-model="value" placeholder="--">
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
                        <div class="version"><p><span>{{$t('m.version')}}:</span> <span>0.0.1</span></p></div>
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
                    <p>©2018 | <span class="name" @click="open('http://lidengju.com/blog/about')">Li Dengju.</span> All
                        rights reserved.</p>
                </el-footer>
            </el-container>
        </el-dialog>
    </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: 'drag-page',
    components: {},
    methods: {
      ...mapActions(['toggleSettingWin']),
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      setting () {
        this.toggleSettingWin(true)
      }
    },
    data () {
      return {
        btnActive: false,
        dialogVisible: false,
        options: [{
          value: '0',
          label: this.$t('m.scale'),
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
        value: '1',
        stack: [{i_name: 'Electron', i_url: 'https://electronjs.org/'}, {
          i_name: 'Vue.js',
          i_url: 'https://vuejs.org/'
        }, {i_name: 'Electron-Vue', i_url: 'https://github.com/SimulatedGREG/electron-vue'}, {
          i_name: 'Vue-CLI',
          i_url: 'https://cli.vuejs.org/'
        }, {
          i_name: 'Vue Router',
          i_url: 'https://router.vuejs.org/'
        }, {
          i_name: 'Axios',
          i_url: 'https://github.com/axios/axios'
        }, {i_name: 'Vuex', i_url: 'https://vuex.vuejs.org/'}, {
          i_name: 'Element-UI',
          i_url: 'https://element.eleme.io/'
        }]
      }
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
        align-items: center;
    }

    .set_button {
        color: black;
        margin-left: 20px;
        background: #F2F2F2;
        box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.50);
        border-radius: 3px;
    }

    .scale_history {
        margin: 40px;
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
</style>
