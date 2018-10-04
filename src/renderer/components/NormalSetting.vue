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
                                    v-for="item in limits"
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
  let limits = [{
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
  let servers = [{value: '100', label: '100'}]
  let langs = [{value: 'en', label: 'English'}, {value: 'zh_cn', label: '简体中文'}, {value: 'zh_hk', label: '繁體中文'}]
  export default {
    name: 'NormalSetting',
    data () {
      return {
        labelPosition: 'left',
        limits: limits,
        hValue: '100',
        servers: servers,
        sValue: '',
        langs: langs,
        lValue: 'en'
      }
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
