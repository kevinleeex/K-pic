import * as types from '../mutation-types'
import {showWin} from '../../utils/sender'

const state = {
  showSettingWin: false
}

const getters = {
  getSettingWinStatus: state => state.showSettingWin
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
