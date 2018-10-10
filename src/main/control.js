/* eslint-disable no-unused-vars */
const os = require('os')
const path = require('path')
const storage = require('electron-json-storage')

export const control = {
  // load the app config
  loadConfig (event) {
    const dataPath = storage.getDataPath()
    console.info('Load!!' + dataPath)
    const tempData = {
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
    storage.get('appConfig', function (error, data) {
      let retMsg
      console.error(error, data)
      const hasConfig = JSON.stringify(data) === '{}'
      if (hasConfig) {
        retMsg = {
          state: false,
          code: 400,
          msg: 'undefined',
          data: tempData
        }
      } else {
        retMsg = {
          state: true,
          code: 200,
          msg: 'Load succeed',
          data: data
        }
      }
      event.sender.send('on-load', retMsg)
    })
  },

  // save the app config
  saveConfig (event, arg) {
    // console.info('!!!' + JSON.stringify(arg))
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
    // storage.setDataPath(path.join(os.homedir(), 'k-pic'))
    const dataPath = storage.getDataPath()
    console.info(dataPath)
    storage.set('appConfig', config, function (error) {
      if (error) {
        console.log('Save failed.')
        retMsg = {
          state: false,
          code: 500
        }
        // throw error
      } else {
        console.log('Save succeed.')
        retMsg = {
          state: true,
          code: 200
        }
      }
      event.sender.send('on-save', retMsg)
    })
  }
}
