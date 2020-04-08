## 配置方式

### .svncommit.config.js

**注意**：目前钩子函数不支持异步函数

```
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
```