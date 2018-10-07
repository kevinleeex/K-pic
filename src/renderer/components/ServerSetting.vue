<template>
    <div>
        <el-container>
            <el-main class="no_drag">
                <el-row :gutter="10">
                    <el-col :span="11">
                        <div class="list_container">
                            <el-table
                                    ref="serverTable"
                                    size="mini"
                                    :data="serverList"
                                    style="width: 100%; font-size: 12px;"
                                    max-height="250"
                                    highlight-current-row
                                    @current-change="handleCurrentChange">
                                <el-table-column
                                        fixed
                                        type="index"
                                        label="#"
                                        width="40">
                                </el-table-column>
                                <el-table-column
                                        fixed
                                        prop="name"
                                        :label="labelConfig.name"
                                        width="120">
                                </el-table-column>
                                <el-table-column :label="$t('m.tips.operation')">
                                    <template slot-scope="scope">
                                        <el-button size="mini" style="font-size: 12px"
                                                   @click="handleEdit(scope.$index, scope.row)">{{$t('m.tips.edit')}}
                                        </el-button>
                                        <el-button size="mini" style="font-size: 12px"
                                                   type="danger"
                                                   @click="handleDelete(scope.$index, scope.row)">
                                            {{$t('m.tips.delete')}}
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="control-panel">
                                <el-button size="mini" type="primary" icon="el-icon-plus" circle
                                           @click="addServer"></el-button>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="13">
                        <div :class="[{detailHidden: detailHiddenStatus}, 'detail']">
                            <el-form ref="form1" :model="serverDetail" label-width="100px" size="mini">
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
                            <el-button type="primary" size="mini" :class="{active: saveHidden}" @click="saveServer">
                                {{$t('m.tips.save')}}
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
  /* eslint-disable no-unused-vars */

  import {mapGetters, mapActions} from 'vuex'
  import {sender, reciever} from '../utils/pipeline'

  let serverTemplate = {
    id: '',
    name: '',
    type: '',
    secretId: '',
    secretKey: '',
    region: '',
    bucket: ''
  }

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
        curItem: 0,
        currentRow: null,
        serverDetail: null,
        saveHidden: true,
        detailHiddenStatus: true
      }
    },
    computed: {
      ...mapGetters(['getCurServer', 'getServerList']),
      serverList: function () {
        return this.getServerList
      }
      // serverDetail: function () {
      //   return (this.serverList.length === 0) ? {
      //     name: '',
      //     type: 'COS',
      //     secretId: '',
      //     secretKey: '',
      //     region: '',
      //     bucket: ''
      //   } : this.currentRow
      // }
    },
    created: function () {
      this.serverDetail = {
        name: '',
        type: 'COS',
        secretId: '',
        secretKey: '',
        region: '',
        bucket: ''
      }
    },
    methods: {
      blurSelect () {
        this.$refs.serverTable.setCurrentRow(null)
      },
      handleEdit (index, row) {
        console.log(index, row)
      },
      handleDelete (index, row) {
        console.log(index, row)
      },
      handleCurrentChange (row) {
        console.info('Selected: ' + JSON.stringify(row))
        this.currentRow = row
        this.detailHiddenStatus = false
        this.saveHidden = true
        this.copyList(row, this.serverDetail)
        // for (let attr in row) {
        //   this.serverDetail[attr] = row[attr]
        // }
        // this.serverDetail = row
      },
      addServer () {
        console.info('add')
        this.blurSelect()
        let server = JSON.parse(JSON.stringify(serverTemplate))
        // for (let attr in server) {
        //   this.serverDetail[attr] = server[attr]
        // }
        this.copyList(server, this.serverDetail)
        this.detailHiddenStatus = false
        this.saveHidden = false
        // this.serverAdd(server)
      },
      delServer (index) {

      },
      saveServer () {
        console.info(JSON.stringify(this.serverDetail))
        let newServer = {}
        this.copyList(this.serverDetail, newServer)
        this.serverAdd(newServer)
        this.detailHiddenStatus = true
        this.saveHidden = true
      },
      copyList (src, target) {
        for (let attr in src) {
          target[attr] = src[attr]
        }
      },
      ...mapActions(['serverAdd', 'serverEdit', 'serverDel'])
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
        width: 42%;
        position: absolute;
        justify-content: center;
        bottom: 1%;
    }

    .active {
        visibility: hidden;
    }

    .detailHidden {
        display: block;
        visibility: hidden;
    }
</style>
