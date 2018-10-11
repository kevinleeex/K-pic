/* eslint-disable no-unused-vars */
import {sender} from '../renderer/utils/pipeline'

const os = require('os')
const path = require('path')
const storage = require('electron-json-storage')
let COS = require('cos-nodejs-sdk-v5')
const {clipboard} = require('electron')

export const uploader = {
  upload (event, arg) {
    const server = arg.serverInfo
    const file = arg.fileInfo
    const setting = arg.settingInfo
    let retData = {code: -1}
    let retMsg = {
      state: false,
      code: 400,
      msg: 'Error',
      data: retData
    }
    let filePro = fileNameTool(file)
    switch (server.type) {
      case 'COS':
        uploadCOS(server, filePro, (retData) => {
          console.info('retData from COS: ', retData)
          if (retData.code === 200) {
            retMsg = {
              state: true,
              code: 200,
              msg: 'Upload succeed',
              data: retData
            }
          } else {
            retMsg = {
              state: false,
              code: 400,
              msg: 'upload failed',
              data: retData
            }
          }
          event.sender.send('on-upload', retMsg)
        })
        break
      case 'OSS':
        break
      case 'QN':
        break
      case 'AWS':
        break
    }
    // end switch
  },
  copy2clipboard (event, arg) {
    console.info('copy to clipboard')
    const isMarkdown = arg.setting.isMarkdown
    const files = arg.files

    let dstList = []
    for (let file of files) {
      if (isMarkdown) {
        const retMarkStr = toMarked(file)
        dstList.push(retMarkStr)
      }
    }
    save2clipboard(dstList.join('\n'))
    event.sender.send('on-copied', dstList.length)
  }
}

const uploadCOS = function (server, filePro, callback) {
  let cos = new COS({SecretId: server.secretId, SecretKey: server.secretKey})
  let retData = {}
  cos.sliceUploadFile({
    Bucket: server.bucket,
    Region: server.region,
    Key: filePro.dstFileName,
    FilePath: filePro.srcPath
  }, function (err, data) {
    console.log(err, data)
    // console.info(data.statusCode)
    if (err === null) {
      retData = {
        code: data.statusCode,
        serverInfo: server,
        fileInfo: {
          timestamp: filePro.timestamp,
          srcPath: filePro.srcPath,
          dstPath: data.Location,
          srcFileName: filePro.srcFileName,
          dstFileName: filePro.dstFileName
        }
      }
    } else {
      retData = {}
    }
    callback(retData)
  })
}

const fileNameTool = function (file) {
  let splitedList = []
  let dstFileName = ''
  let srcFileName = ''
  // process original filename
  let pathSplited = (file.path).split('/')
  srcFileName = pathSplited[pathSplited.length - 1]

  // process destination filename
  if (srcFileName.indexOf('.') !== -1) {
    // file path does contain the suffix
    splitedList = srcFileName.split('.')
    let suffix = splitedList[splitedList.length - 1]
    dstFileName = file.timestamp + '.' + suffix
  } else {
    dstFileName = file.timestamp
  }
  return {timestamp: file.timestamp, srcPath: file.path, srcFileName: srcFileName, dstFileName: dstFileName}
}

const save2clipboard = function (data) {
  clipboard.writeText(data)
}

const toMarked = function (fileInfo) {
  return '![' + fileInfo.srcFileName + '](http://' + fileInfo.dstPath + ')'
}
