const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const msgResult = require('./msgResult.ts');
const fs = require("fs");
const path = require('path');
const {getTime , getLocalAddress, fileIsExist, writeFileFn, readFileFn, writeTxFileFn, jsonToString} = require('./utils.ts');
const monent = require('moment')

app.use(bodyParser.urlencoded({extended: false}));
app.disable('x-powered-by');

app.all('*', (req, resp, next) => {
  resp.header('Access-Control-Allow-Origin', '*');
  resp.header('Access-Control-Allow-Headers', '*');
  resp.header('Access-Control-Allow-Methods', '*');
  req.method.toLowerCase() === 'options' ? resp.send(200) : next();
});

// t66y 记录
app.all('/log', (req: Recordable, resp: Recordable) => {
  let param: Recordable = {}
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
app.post('/getLog', (_: Recordable, resp: Recordable) => {
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
app.all('/txLog', (req: Recordable, resp: Recordable) => {
  let param: Recordable = {}
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
app.post('/getTxLog', (req: Recordable, resp: Recordable) => {
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
app.all('/pornhubLog', (req: Recordable, resp: Recordable) => {
  let param: Recordable = {}
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
app.all('/getPornhubLog', (_: Recordable, resp: Recordable) => {
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
app.all('/checkDesignationLog', (req: Recordable, resp: Recordable) => {
  let result: Recordable = {}
  const text = readFileFn('merge.json')
  let data = JSON.parse(text)

  let code = ''

  if (req.method == "POST") {
    code = req.body.code;
  } else{
    code = req.query.code || req.params.code; 
  }

  code = code.trim()


  const reg = new RegExp('^\\[.+\\]$')
  const reg2 = new RegExp('\\s')
  let codeList: Recordable = []
  if (reg.test(code)) {
    code = code.replace(/'/g, '"')
    codeList = JSON.parse(code)
  } else if (reg2.test(code)) {
    codeList = code.split(' ')
  } else {
    codeList = code.split(',')
  }

  codeList = codeList.map((item: string) => item.toUpperCase())

  codeList.map((item: string) => {
    item = item.toUpperCase()
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
    if (data.pikpak.includes(item)) {
      check = '8'
    }
    result[item] = check
  })
  resp.json(msgResult.msg({status: 200, message: result}));
})

// 番号 保存
app.post('/updateDesignationLog', (req: Recordable, resp: Recordable) => {
  let result = 'ok'
  const text = readFileFn('merge.json')
  let data = JSON.parse(text)

  let code = req.body.code
  let type = req.body.type || '0'
  // let isUpdate = req.body.update

  code = code.trim()


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

  const keyArray = ['unDown', 'read', 'wm', 'wmUnDown', 'lc', 'lcUnDown', 'starUnDown', 'pikpak']

  let changeKey = keyArray[type]

  code.map((item: string) => {
    item = item.toUpperCase()
    data.unDown = data.unDown.filter((codes: string) => codes !== item)
    data.read = data.read.filter((codes: string) => codes !== item)
    data.wm = data.wm.filter((codes: string) => codes !== item)
    data.wmUnDown = data.wmUnDown.filter((codes: string) => codes !== item)
    data.lc = data.lc.filter((codes: string) => codes !== item)
    data.lcUnDown = data.lcUnDown.filter((codes: string) => codes !== item)
    data.starUnDown = data.starUnDown.filter((codes: string) => codes !== item)
    data.pikpak = data.pikpak.filter((codes: string) => codes !== item)
  })

  code = code.map((item: string) => item.toUpperCase())

  data[changeKey].push(...code)

  console.log(`updateDesignationLog - ${monent().format('YYYY-MM-DD HH:mm:ss')} - 准备写入`, type, code);
  const toJson = jsonToString(data, true)
  fs.writeFileSync(path.resolve(__dirname, 'merge.json'), toJson);
  console.log(`updateDesignationLog - ${monent().format('YYYY-MM-DD HH:mm:ss')} - 写入完成`);
  resp.json(msgResult.msg({status: 200, message: result}));
})

// youtube 记录
app.all('/youtubeLog', (req: Recordable, resp: Recordable) => {
  let param: Recordable = {}
  if (req.method == "POST") {
    param = req.body;
  } else{
    param = req.query || req.params; 
  }
  let result = ''
  console.log(`youtube -> ${monent().format('YYYY-MM-DD HH:mm:ss')}`, req.body);
  const _fileIsExist = fileIsExist('youtube_log', 'json')
  if (_fileIsExist) {
    const text = readFileFn('youtube_log.json')
    if (text || text === '') {
      // result = `文件已存在，内容：${readFileFn('youtube_log.json')}`
      const writeResult = writeFileFn('youtube_log.json', text, param.code)
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
    const fileWrite = writeFileFn('youtube_log.json', '', param.code)
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

// youtube 获取
app.post('/getYoutubeLog', (_: Recordable, resp: Recordable) => {
  let result = ''
  const _fileIsExist = fileIsExist('youtube_log', 'json')
  if (_fileIsExist) {
    const text = readFileFn('youtube_log.json')
    if (text || text === '') {
      // result = `文件已存在，内容：${readFileFn('youtube_log.json')}`
      result = text
    } else {
      resp.json(msgResult.error({status: 500, message: '文件读取异常'}));
    }
  } else {
    const fileWrite = writeFileFn('youtube_log.json')
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

app.get('*', (req: Recordable, resp: Recordable) => {
  console.log(`req --> ${monent().format('YYYY-MM-DD HH:mm:ss')}`, req.params[0])
  if (/[\.js|\.css|\.json|\.out]$/.test(req.params[0])) {
    resp.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
    const file = req.params[0].replace(/\/(.*)/, '$1')
    const result = readFileFn(file)
    resp.end(result)
  } else if (/[\.pdf]$/.test(req.params[0])) {
    const files = req.params[0].replace(/\/(.*)/, '$1')
    const file = fs.createReadStream(path.resolve(__dirname, `pdf/${files}`));
    resp.setHeader('Content-Type', 'application/pdf');
    // resp.setHeader('Content-Disposition', 'inline; filename="file.pdf"');
    file.pipe(resp);
  } else {
    resp.status(404).end('什么也没有')
  }
})

// resp.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
//     const file = req.params[0].replace(/\/(.*)/, '$1')
//     const result = readFileFn(`/js/${file}`)
//     resp.end(result)

app.listen(2048, () => {
  console.log(`开启成功(${monent().format('YYYY-MM-DD HH:mm:ss')})：http://${getLocalAddress()}:2048`);
  // reptile.saveJobs();
});