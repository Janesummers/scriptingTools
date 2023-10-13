const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const msgResult = require('./msgResult');
const fs = require("fs");
const path = require('path');
const {getTime , getLocalAddress, fileIsExist, writeFileFn, readFileFn, writeTxFileFn, jsonToString} = require('./utils');

app.use(bodyParser.urlencoded({extended: false}));
app.disable('x-powered-by');

// t66y 记录
app.all('/log', (req, resp) => {
  let param = {}
  if (req.method == "POST") {
    param = req.body;
  } else{
    param = req.query || req.params; 
  }
  let result = ''
  const _fileIsExist = fileIsExist('log', 'json')
  if (_fileIsExist) {
    const text = readFileFn('log.json')
    if (text || text === '') {
      // result = `文件已存在，内容：${readFileFn('log.js')}`
      const writeResult = writeFileFn('log.json', text, param.code)
      if (writeResult) {
        // console.log('writeResult', writeResult);
        if (writeResult === true) {
          result = writeResult
        } else {
          result = JSON.parse(writeResult).join(',')
        }
      } else {
        resp.json(msgResult.error({status: 500, message: '文件重写异常'}));
      }
    } else {
      resp.json(msgResult.error({status: 500, message: '文件读取异常'}));
    }
  } else {
    const fileWrite = writeFileFn('log.json', '', param.code)
    if (fileWrite) {
      result = '文件不存在，已创建文件并写入数据'
    } else {
      resp.json(msgResult.error({status: 500, message: '文件写入异常'}));
    }
  }
  // console.log(`${getTime()} 用户请求：log，${req.headers.token}，${JSON.stringify(req.headers)}`);
  if (req.method == "POST") {
    resp.json(msgResult.msg({status: 200, message: result}));
  } else{
    const str = `handleSuccess()`
    resp.send(`${str}`);
  }
})

// t66y 获取
app.post('/getLog', (req, resp) => {
  let result = ''
  const _fileIsExist = fileIsExist('log', 'json')
  if (_fileIsExist) {
    const text = readFileFn('log.json')
    if (text || text === '') {
      // result = `文件已存在，内容：${readFileFn('log.json')}`
      result = text
    } else {
      resp.json(msgResult.error({status: 500, message: '文件读取异常'}));
    }
  } else {
    const fileWrite = writeFileFn('log.json')
    if (fileWrite) {
      // 文件不存在，已创建文件并写入数据
      result = ''
    } else {
      resp.json(msgResult.error({status: 500, message: '文件写入异常'}));
    }
  }
  // console.log(`${getTime()} 用户请求：log，${req.headers.token}，${JSON.stringify(req.headers)}`);
  resp.json(msgResult.msg({status: 200, message: result}));
})

// 糖心 记录
app.all('/txLog', (req, resp) => {
  let param = {}
  if (req.method == "POST") {
    param = req.body;
  } else{
    param = req.query || req.params; 
  }
  let result = ''
  const _fileIsExist = fileIsExist('tx_log', 'json')
  if (_fileIsExist) {
    const text = readFileFn('tx_log.json')
    if (text || text === '') {
      // result = `文件已存在，内容：${readFileFn('tx_log.js')}`
      const writeResult = writeTxFileFn('tx_log.json', text, param)
      if (writeResult) {
        // console.log('writeResult', writeResult);
        if (writeResult === true) {
          result = writeResult
        } else {
          result = JSON.parse(writeResult)
        }
      } else {
        resp.json(msgResult.error({status: 500, message: '文件重写异常'}));
      }
    } else {
      resp.json(msgResult.error({status: 500, message: '文件读取异常'}));
    }
  } else {
    const fileWrite = writeTxFileFn('tx_log.json', '', param)
    if (fileWrite) {
      result = '文件不存在，已创建文件并写入数据'
    } else {
      resp.json(msgResult.error({status: 500, message: '文件写入异常'}));
    }
  }
  // console.log(`${getTime()} 用户请求：log，${req.headers.token}，${JSON.stringify(req.headers)}`);
  if (req.method == "POST") {
    resp.json(msgResult.msg({status: 200, message: result}));
  } else{
    const str = `handleSuccess()`
    resp.send(`${str}`);
  }
})

// 糖心 获取
app.post('/getTxLog', (req, resp) => {
  // console.log('req', req.body.userCode);
  let result = ''
  const _fileIsExist = fileIsExist('tx_log', 'json')
  if (_fileIsExist) {
    const text = readFileFn('tx_log.json')
    if (text || text === '') {
      // result = `文件已存在，内容：${readFileFn('tx_log.json')}`
      result = text
    } else {
      resp.json(msgResult.error({status: 500, message: '文件读取异常'}));
    }
  } else {
    const fileWrite = writeFileFn('tx_log.json')
    if (fileWrite) {
      // 文件不存在，已创建文件并写入数据
      result = ''
    } else {
      resp.json(msgResult.error({status: 500, message: '文件写入异常'}));
    }
  }
  if (result !== '') {
    const res = JSON.parse(result)
    if (req.body.userCode && res[req.body.userCode]) {
      result = res[req.body.userCode]
    }
  }
  // console.log(`${getTime()} 用户请求：log，${req.headers.token}，${JSON.stringify(req.headers)}`);
  resp.json(msgResult.msg({status: 200, message: result}));
})

// pornhub 记录
app.all('/pornhubLog', (req, resp) => {
  let param = {}
  if (req.method == "POST") {
    param = req.body;
  } else{
    param = req.query || req.params; 
  }
  let result = ''
  const _fileIsExist = fileIsExist('pornhub_log', 'json')
  if (_fileIsExist) {
    const text = readFileFn('pornhub_log.json')
    if (text || text === '') {
      // result = `文件已存在，内容：${readFileFn('pornhub_log.json')}`
      const writeResult = writeFileFn('pornhub_log.json', text, param.code)
      if (writeResult) {
        // console.log('writeResult', writeResult);
        if (writeResult === true) {
          result = writeResult
        } else {
          result = JSON.parse(writeResult).join(',')
        }
      } else {
        resp.json(msgResult.error({status: 500, message: '文件重写异常'}));
      }
    } else {
      resp.json(msgResult.error({status: 500, message: '文件读取异常'}));
    }
  } else {
    const fileWrite = writeFileFn('pornhub_log.json', '', param.code)
    if (fileWrite) {
      result = '文件不存在，已创建文件并写入数据'
    } else {
      resp.json(msgResult.error({status: 500, message: '文件写入异常'}));
    }
  }
  // console.log(`${getTime()} 用户请求：log，${req.headers.token}，${JSON.stringify(req.headers)}`);
  if (req.method == "POST") {
    resp.json(msgResult.msg({status: 200, message: result}));
  } else{
    const str = `handleSuccess()`
    resp.send(`${str}`);
  }
})

// pornhub 获取
app.post('/getPornhubLog', (req, resp) => {
  let result = ''
  const _fileIsExist = fileIsExist('pornhub_log', 'json')
  if (_fileIsExist) {
    const text = readFileFn('pornhub_log.json')
    if (text || text === '') {
      // result = `文件已存在，内容：${readFileFn('pornhub_log.json')}`
      result = text
    } else {
      resp.json(msgResult.error({status: 500, message: '文件读取异常'}));
    }
  } else {
    const fileWrite = writeFileFn('pornhub_log.json')
    if (fileWrite) {
      // 文件不存在，已创建文件并写入数据
      result = ''
    } else {
      resp.json(msgResult.error({status: 500, message: '文件写入异常'}));
    }
  }
  // console.log(`${getTime()} 用户请求：log，${req.headers.token}，${JSON.stringify(req.headers)}`);
  resp.json(msgResult.msg({status: 200, message: result}));
})

// 番号 获取
app.post('/checkDesignationLog', (req, resp) => {
  let result = {}
  const text = readFileFn('merge.json')
  let data = JSON.parse(text)

  let code = req.body.code


  const reg = new RegExp('^\\[.+\\]$')
  const reg2 = new RegExp('\\s')
  if (reg.test(code)) {
    code = code.replace(/'/g, '"')
    code = JSON.parse(code)
  } else if (reg2.test(code)) {
    code = code.split(' ')
  } else {
    code = code.split(',')
  }

  code.map(item => {
    let check = '0'
    if (data.read.includes(item)) {
      check = '1'
    }
    if (data.unDown.includes(item)) {
      check = '2'
    }
    if (data.wm.includes(item)) {
      check = '3'
    }
    if (data.wmUnDown.includes(item)) {
      check = '4'
    }
    if (data.lc.includes(item)) {
      check = '5'
    }
    if (data.lcUnDown.includes(item)) {
      check = '6'
    }
    if (data.starUnDown.includes(item)) {
      check = '7'
    }
    result[item] = check
  })
  resp.json(msgResult.msg({status: 200, message: result}));
})

// 番号 保存
app.post('/updateDesignationLog', (req, resp) => {
  let result = 'ok'
  const text = readFileFn('merge.json')
  let data = JSON.parse(text)

  let code = req.body.code
  let type = req.body.type || '0'
  let isUpdate = req.body.update


  const reg = new RegExp('^\\[.+\\]$')
  const reg2 = new RegExp('\\s')
  if (reg.test(code)) {
    code = code.replace(/'/g, '"')
    code = JSON.parse(code)
  } else if (reg2.test(code)) {
    code = code.split(' ')
  } else {
    code = code.split(',')
  }
  let isChange = false
  if (isUpdate) {
    code.map(item => {
      data.unDown = data.unDown.filter(codes => codes !== item)
      data.read = data.read.filter(codes => codes !== item)
      data.wm = data.wm.filter(codes => codes !== item)
      data.wmUnDown = data.wmUnDown.filter(codes => codes !== item)
      data.lc = data.lc.filter(codes => codes !== item)
      data.lcUnDown = data.lcUnDown.filter(codes => codes !== item)
      data.starUnDown = data.starUnDown.filter(codes => codes !== item)
      switch (type) {
        case '0':
          if (!data.unDown.includes(item)) {
            data.unDown.push(item)
          }
          break;
        case '1':
          if (!data.read.includes(item)) {
            data.read.push(item)
          }
          break;
        case '3':
          if (!data.wm.includes(item)) {
            data.wm.push(item)
          }
          break;
        case '4':
          if (!data.wmUnDown.includes(item)) {
            data.wmUnDown.push(item)
          }
          break;
        case '5':
          if (!data.lc.includes(item)) {
            data.lc.push(item)
          }
          break;
        case '6':
          if (!data.lcUnDown.includes(item)) {
            data.lcUnDown.push(item)
          }
          break;
        case '7':
          if (!data.starUnDown.includes(item)) {
            data.starUnDown.push(item)
          }
          break;
        default:
          break;
      }
    })
    const toJson = jsonToString(data, true)
    fs.writeFileSync(path.resolve(__dirname, 'merge.json'), toJson);
  } else {
    code.map(item => {
      if (!data.unDown.includes(item) && !data.read.includes(item) && !data.wm.includes(item) && !data.wmUnDown.includes(item) && !data.lc.includes(item) && !data.lcUnDown.includes(item) && !data.starUnDown.includes(item)) {
        isChange = true
        switch (type) {
          case '0':
            if (!data.unDown.includes(item)) {
              data.unDown.push(item)
            }
            break;
          case '1':
            if (!data.read.includes(item)) {
              data.read.push(item)
            }
            break;
          case '3':
            if (!data.wm.includes(item)) {
              data.wm.push(item)
            }
            break;
          case '4':
            if (!data.wmUnDown.includes(item)) {
              data.wmUnDown.push(item)
            }
            break;
          case '5':
            if (!data.lc.includes(item)) {
              data.lc.push(item)
            }
            break;
          case '6':
            if (!data.lcUnDown.includes(item)) {
              data.lcUnDown.push(item)
            }
            break;
          case '7':
            if (!data.starUnDown.includes(item)) {
              data.starUnDown.push(item)
            }
            break;
          default:
            break;
        } 
      }
    })
  }
  console.log("updateDesignationLog - 准备写入", isChange, isUpdate, type, code);
  if (isChange) {
    const toJson = jsonToString(data, true)
    fs.writeFileSync(path.resolve(__dirname, 'merge.json'), toJson);
    console.log("updateDesignationLog - 写入完成");
  }
  resp.json(msgResult.msg({status: 200, message: result}));
})

app.get('*', (req, resp) => {
  console.log('req', req.params[0])
  resp.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
  if (/[\.js|\.css|\.json|\.out]$/.test(req.params[0])) {
    const file = req.params[0].replace(/\/(.*)/, '$1')
    const result = readFileFn(file)
    resp.end(result)
  } else {
    resp.status(404).end('什么也没有')
  }
})

app.listen(2048, () => {
  console.log(`开启成功：http://${getLocalAddress()}:2048`);
  // reptile.saveJobs();
});