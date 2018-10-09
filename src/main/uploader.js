/* eslint-disable no-unused-vars */
const os = require('os')
const path = require('path')
const storage = require('electron-json-storage')
let COS = require('cos-nodejs-sdk-v5')
const {clipboard} = require('electron')

export const uploader = {
  upload (event, arg) {
    const server = arg.serverInfo
    const files = arg.filesInfo
    const setting = arg.settingInfo

    for (let file of files) {
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
          try {
            uploadCOS(server, filePro, (retData) => {
              console.info('retData2: ', retData)
              if (retData.code === 200) {
                retMsg = {
                  state: true,
                  code: 200,
                  msg: 'Upload succeed',
                  data: retData
                }
                save2clipboard(setting, retData)
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
          } catch (e) {
            console.error('error: ', e)
            event.sender.send('on-upload', retMsg)
            return
          }
          break
        case 'OSS':
          break
        case 'QN':
          break
        case 'AWS':
          break
      }
    }
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
    console.info(data.statusCode)
    if (data.statusCode === 200) {
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

const save2clipboard = function (setting, retData) {
  if (setting.isMarkdown) {
    clipboard.writeText('![' + retData.fileInfo.srcFileName + '](http://' + retData.fileInfo.dstPath + ')')
  } else {
    clipboard.writeText(retData.fileInfo.dstPath)
  }
}
