#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const cmd = require('node-cmd')
const ora = require('ora')
const inquirer = require('inquirer')
const chalk = require('chalk')
const program = require('commander')
const { copyDirSync } = require('tanxin-node-utils/package/file/copyDir')

/**
 * 删除svn目录里面的源代码
 *
 * @param {String} to 目标文件夹（svn项目目录）
 * @param {String} config 配置对象
 */
function svnDelete(to, ignore, callback) {
  const dirs = fs.readdirSync(to)

  let svnDirIndex = -1
  const dirPaths = dirs.filter((dir, i) => {
    const isIgnore = dir.indexOf('.svn') >= 0 || ignore.some((i) => i.test(dir))
    const itemPath = path.join(to, dir)
    const isExist = fs.existsSync(itemPath)
    return !isIgnore && isExist
  }).map((dir, i) => {
    const itemPath = path.join(to, dir)
    return `"${itemPath}"`
  })
  if (dirPaths.length) {
    const deleteConmmand = `svn delete ${dirPaths.join(' ')}`
    const deleteLabel = 'svn delete ...'
    excuteSvnCommand(deleteConmmand, deleteLabel, callback)
  } else {
    callback()
  }
}

/**
 * 执行svn命令
 *
 * @param {String} command svn命令
 * @param {String} spinerLabel spiner显示的标签
 * @param {Function} callback 执行完后的回调
 */
function excuteSvnCommand(command, spinerLabel, callback) {
  const spiner = spinerLabel ? ora(spinerLabel).start() : null
  cmd.get(command, (err, data, stderr) => {
    spiner && spiner.stop()
    if (err) {
      throw err
    }
    console.log() // 控制台打印空行
    callback(data, stderr)
  })
}

function svnUpdate(to, callback) {
  const updatCommand = `svn update ${to}`
  const updateLabel = 'svn updating...'

  excuteSvnCommand(updatCommand, updateLabel, (updateData) => {
    console.log(chalk.green(updateData))
    callback && callback(updateData)
  })
}

function svnCommit(to, desc, callback) {
  const addCommond = `svn add ${to}/* --force`
  const addLabel = 'svn add... '
  excuteSvnCommand(addCommond, addLabel, (addData) => {
    console.log(addData)
    const commitCommand = `svn commit -m "${desc}" ${to}`
    const commitLabel = 'commit code to svn...'
    excuteSvnCommand(commitCommand, commitLabel, (commitData) => {
      console.log(commitData)
      callback && callback()
    })
  })
}

/**
 * 验证配置合法性
 *
 * @param {Pbject} config 配置参数
 */
function validateConfig(config) {
  const { from, to } = config
  const noConfigDir = !from || !to
  const noFromDir = !fs.existsSync(from)
  if (noConfigDir || noFromDir) {
    throw new Error('svn-committer invalid config')
  }
}


/**
 * 验证提交说明的合法性
 *
 * @param {Object} config
 * @param {String} comments
 */
function validateComments(config, comments) {
  let commentsLengthLimit = config.commentsLengthLimit
  commentsLengthLimit = commentsLengthLimit || 5

  const isCommentsValidated = comments && comments.length >= commentsLengthLimit

  return isCommentsValidated
}

function getConfig() {
  const configFilePath = path.resolve(process.cwd(),'.svncommitter.config.js')
  if (fs.existsSync(configFilePath)) {
    console.log(configFilePath)
    return require(configFilePath)
  } else {
    console.log(chalk.red('缺少配置文件 .svncommitter.config.js'))
    return null
  }
}

function callHook(type, config) {
  const hook = config[type]
  hook && typeof hook === 'function' && hook(config)
}

function publish(config, desc) {

  svnUpdate(config.to, () => {

    callHook('beforeDelete', config)
    svnDelete(config.to, config.ignore, () => {
      callHook('afterDelete', config)

      callHook('beforeCopy', config)
      copyDirSync(config.from, config.to, (from) => {
        return config.ignore.some((i) => i.test(from))
      })
      callHook('afterCopy', config)

      callHook('beforeCommit', config)
      svnCommit(config.to, desc, () => {
        callHook('afterCommit', config)
      })
    })
  })
}

program.command('commit').action(function (env, options) {

  const config = getConfig()
  if (!config) {
    return
  }
  validateConfig(config)

  const { comments } = program
  const isCommentsValidated = validateComments(config, comments)
  if (!isCommentsValidated) {
    console.log(chalk.red('必须提交说明，提交说明的长度应不少于' + config.commentsLengthLimit + '  -c/--comments [your comments]'))
    return
  }

  if (!fs.existsSync(config.to)) {
    fs.mkdirSync(config.to)
  }

  publish(config, comments)
})
program.option("-c --comments <comments>", "提交说明")

program.parse(process.argv)