/* eslint-disable no-unused-lets,no-unused-vars */
const fs = require('fs')
const request = require('request')

export const streamDownloader = {
  download (configuration, callback) {
    return new Promise(function (resolve, reject) {
      // Save letiable to know progress
      let receivedBytes = 0
      let totalBytes = 0
      let req = request.get(configuration.remoteFile)

      callback(configuration.localFile)
      let out = fs.createWriteStream(configuration.localFile)
      req.pipe(out)

      req.on('response', function (data) {
        // callback(data)
        // Change the total bytes value to get progress later.
        totalBytes = parseInt(data.headers['content-length'])
      })

      // Get progress if callback exists
      if (configuration.hasOwnProperty('onProgress')) {
        req.on('data', function (chunk) {
          // Update the received bytes
          receivedBytes += chunk.length

          configuration.onProgress(receivedBytes, totalBytes)
        })
      } else {
        req.on('data', function (chunk) {
          // Update the received bytes
          receivedBytes += chunk.length
        })
      }
      req.on('error', function (e) {
        console.log('Error: ' + e.message)
        req.abort()
        configuration.onError()
      })
      req.on('end', function () {
        resolve()
      })
    })
  }
}
