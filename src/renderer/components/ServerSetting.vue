<template>
    <div>
        <el-container>
            <el-main class="no_drag">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <div class="list_container">
                            <el-table
                                    :data="serverList"
                                    style="width: 100%"
                                    max-height="280">
                                <el-table-column
                                        fixed
                                        prop="id"
                                        label="#"
                                        width="40">
                                </el-table-column>
                                <el-table-column
                                        fixed
                                        prop="name"
                                        :label="labelConfig.name"
                                        width="150">
                                </el-table-column>
                            </el-table>
                            <div class="control-panel">
                                <el-button size="mini" type="danger" icon="el-icon-minus" circle></el-button>
                                <el-button size="mini" type="primary" icon="el-icon-plus" circle></el-button>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="detail">
                            <el-form ref="form" :model="serverDetail" label-width="100px" size="mini">
                                <el-form-item :label="labelConfig.name">
                                    <el-col :span="8">
                                        <el-input v-model="serverDetail.name"></el-input>
                                    </el-col>
                                    <el-col :span="2"></el-col>
                                    <el-col :span="6">{{labelConfig.type}}</el-col>
                                    <el-col :span="8">
                                        <el-select v-model="stValue" placeholder="--">
                                            <el-option
                                                    v-for="item in serviceOptions"
                                                    :key="item.stValue"
                                                    :label="item.stLabel"
                                                    :value="item.stValue">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item :label="labelConfig.secretId">
                                    <el-input v-model="serverDetail.secretId"></el-input>
                                </el-form-item>
                                <el-form-item :label="labelConfig.secretKey">
                                    <el-input v-model="serverDetail.secretKey"></el-input>
                                </el-form-item>
                                <el-form-item :label="labelConfig.bucket">
                                    <el-input v-model="serverDetail.bucket"></el-input>
                                </el-form-item>
                                <el-form-item :label="labelConfig.region">
                                    <el-input v-model="serverDetail.region"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
  export default {
    name: 'ServerSetting',
    data () {
      return {
        labelConfig: {
          name: this.$t('m.labelConfig.name'),
          type: this.$t('m.labelConfig.serviceType'),
          secretId: this.$t('m.labelConfig.secretId'),
          secretKey: this.$t('m.labelConfig.secretKey'),
          region: this.$t('m.labelConfig.region'),
          bucket: this.$t('m.labelConfig.bucket')
        },
        serviceOptions: [{
          stValue: 'COS',
          stLabel: 'COS'
        }, {
          stValue: 'OOS',
          stLabel: 'OOS'
        }],
        stValue: 'COS',
        activeIndex: '1',
        serverList: '',
        serverDetail: ''
      }
    }
  }
</script>

<style scoped>
    .list_container {
        background: #f3f3f3;
        height: 300px;
        padding: 5px;
    }

    .detail {
        border: 4px solid #f3f3f3;
        height: 300px;
        padding: 10px;
    }

    .control-panel {
        width: 30%;
        position: absolute;
        justify-content: center;
        bottom: 1%;
    }
</style>
