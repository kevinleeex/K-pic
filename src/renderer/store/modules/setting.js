import * as types from '../mutation-types'
import {showWin} from '../../utils/pipeline'

const state = {
  showSettingWin: false,
  historyList: [{}]
}

const getters = {
  getSettingWinStatus: state => state.showSettingWin,
  getHostory: state => state.history
}

const actions = {
  toggleSettingWin ({state, commit, rootState}, showSettingWin) {
    commit(types.TOGGLE_SETTING_WIN, showSettingWin)
  }
}

const mutations = {
  [types.TOGGLE_SETTING_WIN] (state, showSettingWin) {
    if (typeof (showSettingWin) === 'boolean') {
      state.showSettingWin = showSettingWin
    } else {
      state.showSettingWin = !state.showSettingWin
    }
    showWin(showSettingWin)
  },
  [types.ADD_HISTORY] (state, data) {
    console.info('add server')
    state.historyList.push(data)
  },
  [types.DEL_HISTORY] (state, index) {
    console.info('delete history: ' + index)
    state.historyList.splice(index, 1)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
