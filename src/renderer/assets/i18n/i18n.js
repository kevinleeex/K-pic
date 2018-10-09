import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {local} from '@/utils/storage'
// import messages from 'langs'

Vue.use(VueI18n)

// get language from the local storage or en as default.
let language = local.getItem('lang')
console.info(language)
const i18n = new VueI18n({
  locale: language || 'en',
  messages: {
    'zh_cn': require('./langs/zh_cn'), // 中文语言包
    'zh_hk': require('./langs/zh_hk'), // 中国香港语言
    'en': require('./langs/en') // 英文语言包
  }
})

export default i18n
