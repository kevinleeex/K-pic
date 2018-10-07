<template>
    <div>
        <el-container>
            <el-main>
                <div class="k_item is-centered no_drag" style="display: flex">
                    <div class="label_container" style="width: 30%;"><span style="display: inline-block;"
                                                                           class="fifty-shades">{{$t('m.limit')}}</span>
                    </div>
                    <div style="width: 70%">
                        <el-select class="set_button limit_button" v-model="hValue" placeholder="--">
                            <el-option
                                    v-for="item in historyLimit"
                                    :key="item.key"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="k_item is-centered no_drag" style="display: flex">
                    <div class="label_container" style="width: 30%"><span
                            class="fifty-shades">{{$t('m.imgSizeLimit')}}</span></div>
                    <div style="width: 70%">
                        <el-select class="set_button limit_button" v-model="iValue" filterable placeholder="--">
                            <el-option
                                    v-for="item in imgSize"
                                    :key="item.key"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="k_item is-centered no_drag" style="display: flex">
                    <div class="label_container" style="width: 30%"><span
                            class="fifty-shades">{{$t('m.workWith')}}</span></div>
                    <div style="width: 70%">
                        <el-select class="set_button limit_button" v-model="sValue" filterable placeholder="--">
                            <el-option
                                    v-for="item in servers"
                                    :key="item.key"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="k_item is-centered no_drag" style="display: flex">
                    <div class="label_container" style="width: 30%"><span
                            class="fifty-shades">{{$t('m.language')}}</span></div>
                    <div style="width: 70%">
                        <el-select class="set_button limit_button" v-model="lValue" placeholder="--">
                            <el-option
                                    v-for="item in langs"
                                    :key="item.key"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
  /* eslint-disable no-unused-vars */

  import {mapActions, mapGetters} from 'vuex'

  let historyLimit = [{
    value: '100',
    label: '100'
  }, {
    value: '80',
    label: '80'
  }, {
    value: '40',
    label: '40'
  }, {
    value: '20',
    label: '20'
  }, {
    value: '0',
    label: '0'
  }]
  let imgSize = [{value: '2', label: '2M'}, {value: '5', label: '5M'}, {value: '10', label: '10M'}, {
    value: '20',
    label: '20M'
  }, {value: '-1', label: 'Unlimited'}]
  let servers = [{value: '100', label: '100'}]
  let langs = [{value: 'en', label: 'English'}, {value: 'zh_cn', label: '简体中文'}, {value: 'zh_hk', label: '繁體中文'}]
  export default {
    name: 'NormalSetting',
    data () {
      let serverList = this.getServerList
      return {
        labelPosition: 'left',
        historyLimit: historyLimit,
        hValue: '',
        imgSize: imgSize,
        iValue: '',
        servers: serverList,
        sValue: '',
        langs: langs,
        lValue: ''
      }
    },
    computed: {
      ...mapGetters(['getCurServer', 'getCommonSet', 'getServerList']),
      commonConfig: function () {
        return {
          commonSet: {
            language: this.lValue,
            historyLimit: this.hValue,
            imgSizeLimit: this.iValue,
            workWith: this.sValue
          }
        }
      }
    },
    watch: {
      hValue: function () {
        this.setCommonConfig(this.commonConfig)
      },
      iValue: function () {
        this.setCommonConfig(this.commonConfig)
      },
      sValue: function () {
        this.setCommonConfig(this.commonConfig)
      },
      lValue: function () {
        this.setCommonConfig(this.commonConfig)
      }
    },
    mounted: function () {
      this.initConfig()
    },
    methods: {
      initConfig () {
        this.hValue = this.getCommonSet.historyLimit
        this.iValue = this.getCommonSet.imgSizeLimit
        this.sValue = this.getCommonSet.workWith
        this.lValue = this.getCommonSet.language
      },
      ...mapActions(['setCommonConfig'])
    }
  }
</script>

<style scoped>

    input.el-input__inner {
        height: 30px;
    }

    .limit_button input {
        width: 100px;
        height: 30px !important;
        font-weight: bold;
        background: #F2F2F2;
        box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.50);
        border-radius: 3px;
    }

    .limit_button div {
        background: #F2F2F2;
        box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.50);
        border-radius: 3px;
    }

    .set_button {
        color: black;
        margin-left: 20px;
        background: #F2F2F2;
        box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.50);
        border-radius: 3px;
    }

    div.k_item {
        margin: 10px;
    }

    .fifty-shades {
        color: #666666;
        align-items: center;
        height: 100%;
        line-height: 40px;
    }

    .label_container {
        text-align: right;
    }


</style>
