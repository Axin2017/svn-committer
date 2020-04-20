const path = require('path')
const fs = require('fs')
const { copyDirSync } = require('tanxin-node-utils/package/file/copyDir')
module.exports = {
  from: 'E:/jsproject/chinadci/front/dci3d-onemap',
  to: 'E:/jsproject/chinadci/tanxin-test',
  ignore:[
    /.svn/,
    /favicon.ico/
  ],
  commentsLengthLimit: 5,
  beforeDelete: (config) => {
    const now = new Date()
    const timeSpan = `${now.getFullYear()}${now.getMonth()+1}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`
    copyDirSync(config.to, `${config.to}_${timeSpan}`)
  },
  afterDelete: () => {

  },
  beforeCopy: (config) => {
    
  },
  afterCopy: () => {

  },
  beforeCommit: () => {

  },
  afterCommit: () => {
    
  }
}