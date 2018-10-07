import * as types from '../mutation-types'

const state = {
  curServer: {
    id: '',
    name: '',
    type: '',
    secretId: '',
    secretKey: '',
    region: '',
    bucket: ''
  },
  serverList: [],
  commonSet: {
    language: 'en',
    historyLimit: '100',
    imgSizeLimit: '5',
    workWith: ''
  }
}

const getters = {
  getCurServer: state => state.curServer,
  getServerList: state => state.serverList,
  getCommonSet: state => state.commonSet
}

const actions = {
  // getConfig ({state, commit}) {
  //   commit(types.GET_CONFIG)
  // },
  setConfig ({state, commit}, config) {
    commit(types.SET_CONFIG, config)
  },
  setCommonConfig ({state, commit}, data) {
    commit(types.SET_COMMON_CONFIG, data)
  },
  serverAdd ({state, commit}, data) {
    commit(types.ADD_SERVER, data)
  },
  serverDel ({state, commit}, data) {
    commit(types.DEL_SERVER, data)
  },
  serverEdit ({state, commit}, data) {
    commit(types.EDIT_SERVER, data)
  }
}

const mutations = {
  // [types.GET_CONFIG] (state) {
  //
  // },
  [types.SET_CONFIG] (state, data) {
    state.curServer = data.curServer
    state.serverList = data.serverList
    state.commonSet = data.commonSet
  },
  [types.SET_COMMON_CONFIG] (state, data) {
    state.commonSet = data.commonSet
  },
  [types.SET_SERVER_CONFIG] (state, data) {
    state.serverList = data.serverList
    state.curServer = data.curServer
  },
  [types.ADD_SERVER] (state, data) {
    console.info('add server')
    state.serverList.push(data)
  },
  [types.DEL_SERVER] (state, index) {
    console.info('Delete: ' + index)
    state.serverList.splice(index, 1)
  },
  [types.EDIT_SERVER] (state, data) {
    console.info('Edit: index ' + data.index)
    state.serverList[data.index] = data.data
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
