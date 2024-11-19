const os = require('os');
const _fs = require("fs");
const _path = require('path');

exports.getTime = () => {
  let d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1 <= 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}-${d.getDate() <= 9 ? '0' + d.getDate() : d.getDate()} ${d.getHours() <= 9 ? '0' + d.getHours() : d.getHours()}:${d.getMinutes() <= 9 ? '0' + d.getMinutes() : d.getMinutes()}:${d.getSeconds() <= 9 ? '0' + d.getSeconds() : d.getSeconds()}`;
}

exports.getLocalAddress = () => {
  const faces = os.networkInterfaces()
  for (let dev in faces) {
    const netInfo = faces[dev]
    for (let i = 0; i < netInfo.length; i++) {
      let { family, address, internal } = netInfo[i]
      if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
        return address
      }
    }
  }
}


exports.fileIsExist = (fileName = '', suffix = '') => {
  if (fileName === '' || suffix === '') {
    throw('缺少文件名或文件后缀参数')
  }
  if (typeof fileName !== 'string') {
    throw('文件名必须为字符串')
  }
  if (typeof suffix !== 'string') {
    throw('文件后缀名必须为字符串')
  }
  try {
    const result = _fs.statSync(_path.resolve(__dirname, `${fileName}.${suffix}`));
    return result;
  } catch (error) {
    return false;
  }
}

exports.writeFileFn = (fileFullName: string, originText = '', text = '') => {
  if (fileFullName === '') {
    throw('缺少完整的文件名')
  }
  try {
    let writeText = ''
    const reg = new RegExp('^\\[.+\\]$')
    if (reg.test(text)) {
      text = text.replace(/'/g, '"')
      text = JSON.parse(text)
    }
    let originData;
    if (originText !== '') {
      originData = JSON.parse(originText)
      if (Object.prototype.toString.call(text).indexOf('Array') !== -1) {
        const mergeData = originData.concat(text)
        originData = [...new Set(mergeData)]
      } else {
        if (originData.indexOf(text.toString()) !== -1) {
          return JSON.stringify(originData);
        }
        originData.push(text.toString())
      }
      writeText = JSON.stringify(originData)
    } else {
      if (Object.prototype.toString.call(text).indexOf('Array') !== -1) {
        writeText = JSON.stringify([...text])
      } else {
        writeText = JSON.stringify([text.toString()])
      }
    }
    _fs.writeFileSync(_path.resolve(__dirname, `${fileFullName}`), writeText);
    // console.log('writeText',writeText);
    return writeText;
  } catch (error) {
    console.log('文件写入错误：', error);
    return false;
  }
}

exports.readFileFn = (fileFullName: string) => {
  if (fileFullName === '') {
    throw('缺少完整的文件名')
  }
  try {
    const result = _fs.readFileSync(_path.resolve(__dirname, `${fileFullName}`));
    return result.toString()
  } catch (error) {
    return false
  }
}


exports.writeTxFileFn = (fileFullName: string, originText = '', reqData: Recordable = {}) => {
  if (fileFullName === '') {
    throw('缺少完整的文件名')
  }
  try {
    let writeText = ''
    let originData;
    if (originText !== '') {
      originData = JSON.parse(originText)
      if (originData[reqData.userCode]) {
        if (originData[reqData.userCode].indexOf(reqData.title.toString()) !== -1) {
          return JSON.stringify(originData);
        }
        originData[reqData.userCode].push(reqData.title.toString())
      } else {
        originData[reqData.userCode] = [reqData.title.toString()]
      }
      writeText = JSON.stringify(originData)
    } else {
      writeText = JSON.stringify({[reqData.userCode]: [reqData.title.toString()]})
    }
    _fs.writeFileSync(_path.resolve(__dirname, `${fileFullName}`), writeText);
    // console.log('writeText',writeText);
    return writeText;
  } catch (error) {
    console.log('文件写入错误：', error);
    return false;
  }
}

exports.writeJavRecordFileFn = (fileFullName: string, originText = '', reqData: Recordable = {}) => {
  if (fileFullName === '') {
    throw('缺少完整的文件名')
  }
  try {
    let writeText = ''
    let originData;
    if (originText !== '') {
      originData = JSON.parse(originText)
      if (originData[reqData.type]) {
        if (originData[reqData.type][reqData.code]) {
          return JSON.stringify(originData);
        }
        switch (reqData.type) {
          case 'tags':
            originData[reqData.type][reqData.code] = { code: reqData.params.toString(), title: reqData.title.toString(), link: `/${reqData.type.toString()}${reqData.extend ? `/${reqData.extend.toString()}` : ''}/${reqData.params.toString()}` }
            break;
          case 'search':
            originData[reqData.type][reqData.code] = { code: reqData.code.toString(), title: reqData.title.toString(), link: `/${reqData.type.toString()}/${reqData.params.toString()}` }
            break;
        
          default:
            originData[reqData.type][reqData.code] = { code: reqData.code.toString(), title: reqData.title.toString(), link: `/${reqData.type.toString()}/${reqData.code.toString()}` }
            break;
        }
      } else {
         switch (reqData.type) {
          case 'tags':
            originData[reqData.type][reqData.code] = { code: reqData.params.toString(), title: reqData.title.toString(), link: `/${reqData.type.toString()}${reqData.extend ? `/${reqData.extend.toString()}` : ''}/${reqData.params.toString()}` }
            break;
          case 'search':
            originData[reqData.type][reqData.code] = { code: reqData.code.toString(), title: reqData.title.toString(), link: `/${reqData.type.toString()}/${reqData.params.toString()}` }
            break;
            
          default:
            originData[reqData.type][reqData.code] = {
              [reqData.code]: { code: reqData.code.toString(), title: reqData.title.toString(), link: `/${reqData.type.toString()}/${reqData.code.toString()}` }
            }
            break;
        }
      }
      writeText = JSON.stringify(originData)
    } else {
      switch (reqData.type) {
        case 'tags':
          writeText = JSON.stringify({[reqData.type]: {
            [reqData.code]: { code: reqData.params.toString(), title: reqData.title.toString(), link: `/${reqData.type.toString()}${reqData.extend ? `/${reqData.extend.toString()}` : ''}/${reqData.params.toString()}` }
          }})
          break;
        case 'search':
          writeText = JSON.stringify({[reqData.type]: {
            [reqData.code]: { code: reqData.code.toString(), title: reqData.title.toString(), link: `/${reqData.type.toString()}/${reqData.params.toString()}` }
          }})
          break;
      
        default:
          writeText = JSON.stringify({[reqData.type]: {
            [reqData.code]: { code: reqData.code.toString(), title: reqData.title.toString(), link: `/${reqData.type.toString()}/${reqData.code.toString()}` }
          }})
          break;
      }
      
    }
    _fs.writeFileSync(_path.resolve(__dirname, `${fileFullName}`), writeText);
    // console.log('writeText',writeText);
    return writeText;
  } catch (error) {
    console.log('文件写入错误：', error);
    return false;
  }
}

function JSON_TO_STRING (obj: any, skipBasicObj: boolean = false, level = 0): string {
  const getLevelSpaces = (level: number) => Array(level * 2).fill(' ').join('');
  const isBasicType = (item: any) => item === null || typeof item !== 'object';
  if (obj === null || obj === undefined) return 'null';
  if (typeof obj === 'string') return '"' + obj.replace(/"/g, '\\"') + '"';
  if (typeof obj !== 'object') return obj.toString();
  if (Array.isArray(obj)) {
    // 间隔
    if (obj.every(item => isBasicType(item))) return '[' + obj.map(i => JSON_TO_STRING(i)).join(',') + ']';
    return '[\n' + getLevelSpaces(level + 1) + obj.map(item => JSON_TO_STRING(item, skipBasicObj, level + 1)).join(',\n' + getLevelSpaces(level + 1)) + '\n' + getLevelSpaces(level) + ']';
  }
  const entries = Object.entries(obj).filter(value => value[1] !== undefined);
  if (entries.length === 0) return '{}';
  if (skipBasicObj && entries.every(value => isBasicType(value[1]))) {
    return '{' + entries.map(value => '"' + value[0] + '": ' + JSON_TO_STRING(value[1], skipBasicObj)).join(', ') + '}';
  }
  return '{\n' + getLevelSpaces(level + 1) + entries.map(value => '"' + value[0] + '": ' + JSON_TO_STRING(value[1], skipBasicObj, level + 1)).join(',\n' + getLevelSpaces(level + 1)) + '\n' + getLevelSpaces(level) + '}';
}

exports.jsonToString = (obj: any, skipBasicObj: boolean = false, level = 0) :string => {
  return JSON_TO_STRING(obj, skipBasicObj, level)
}

