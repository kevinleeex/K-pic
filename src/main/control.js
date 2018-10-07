/* eslint-disable no-unused-vars */
const storage = require('electron-json-storage')

export const control = {
  // load the app config
  loadConfig (event) {
    let val = storage.get('appConfig')
    let retMsg
    console.info('!!!' + val)
    if (val === undefined) {
      retMsg = {
        state: false,
        code: 403,
        msg: 'undefined',
        data: {}
      }
      event.sender.send('on-load', retMsg)
      // console.info(retMsg)
      return false
    }
    retMsg = {
      state: true,
      code: 200,
      msg: 'success',
      data: val
    }
    event.sender.send('on-load', retMsg)
  },

  // save the app config
  saveConfig (event, arg) {
    let config = {
      curServer: {
        id: arg.curServer.id,
        name: arg.curServer.name,
        type: arg.curServer.type,
        secretId: arg.curServer.secretId,
        secretKey: arg.curServer.secretKey,
        region: arg.curServer.region,
        bucket: arg.curServer.bucket
      },
      serverList: arg.serverList,
      commonSet: {
        language: arg.commonSet.language,
        historyLimit: arg.commonSet.historyLimit,
        imgSizeLimit: arg.commonSet.imgSizeLimit,
        workWith: arg.commonSet.workWith
      }
    }

    let retMsg
    storage.set('appConfig', config, function (error) {
      if (error) {
        console.log('Save failed.')
        retMsg = {
          state: false,
          code: 500
        }
        event.sender.send('on-save', retMsg)
        // throw error
      } else {
        console.log('Save succeed.')
        retMsg = {
          state: true,
          code: 200
        }
        event.sender.send('on-save', retMsg)
      }
    })
  }
}
