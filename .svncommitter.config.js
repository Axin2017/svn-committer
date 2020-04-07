const path = require('path')
const fs = require('fs')

module.exports = {
  from: 'E:/jsproject/chinadci/tanxin-test1',
  to: 'E:/jsproject/chinadci/tanxin-test',
  ignore:[
    /111/
  ],
  beforeDelete: (config) => {
    
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