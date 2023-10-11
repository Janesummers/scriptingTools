const os = require('os');
const fs = require("fs");
const path = require('path');

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
    return false
  }
  if (typeof fileName !== 'string') {
    throw('文件名必须为字符串')
    return false
  }
  if (typeof suffix !== 'string') {
    throw('文件后缀名必须为字符串')
    return false
  }
  try {
    const result = fs.statSync(path.resolve(__dirname, `${fileName}.${suffix}`));
    return result;
  } catch (error) {
    return false;
  }
}

exports.writeFileFn = (fileFullName, originText = '', text = '') => {
  if (fileFullName === '') {
    throw('缺少完整的文件名')
    return false
  }
  try {
    let writeText = ''
    const reg = new RegExp('^\\[.+\\]$')
    if (reg.test(text)) {
      text = text.replace(/'/g, '"')
      text = JSON.parse(text)
    }
    if (originText !== '') {
      originText = JSON.parse(originText)
      if (Object.prototype.toString.call(text).indexOf('Array') !== -1) {
        let mergeData = originText.concat(text)
        mergeData = [...new Set(mergeData)]
        originText = mergeData
      } else {
        if (originText.indexOf(text.toString()) !== -1) {
          return JSON.stringify(originText);
        }
        originText.push(text.toString())
      }
      writeText = JSON.stringify(originText)
    } else {
      if (Object.prototype.toString.call(text).indexOf('Array') !== -1) {
        writeText = JSON.stringify([...text])
      } else {
        writeText = JSON.stringify([text.toString()])
      }
    }
    fs.writeFileSync(path.resolve(__dirname, `${fileFullName}`), writeText);
    console.log('writeText',writeText);
    return writeText;
  } catch (error) {
    console.log('文件写入错误：', error);
    return false;
  }
}

exports.readFileFn = (fileFullName) => {
  if (fileFullName === '') {
    throw('缺少完整的文件名')
    return false
  }
  try {
    const result = fs.readFileSync(path.resolve(__dirname, `${fileFullName}`));
    return result.toString()
  } catch (error) {
    return false
  }
}


exports.writeTxFileFn = (fileFullName, originText = '', reqData = {}) => {
  if (fileFullName === '') {
    throw('缺少完整的文件名')
    return false
  }
  try {
    let writeText = ''
    if (originText !== '') {
      originText = JSON.parse(originText)
      if (originText[reqData.userCode]) {
        if (originText[reqData.userCode].indexOf(reqData.title.toString()) !== -1) {
          return JSON.stringify(originText);
        }
        originText[reqData.userCode].push(reqData.title.toString())
      } else {
        originText[reqData.userCode] = [reqData.title.toString()]
      }
      writeText = JSON.stringify(originText)
    } else {
      writeText = JSON.stringify({[reqData.userCode]: [reqData.title.toString()]})
    }
    fs.writeFileSync(path.resolve(__dirname, `${fileFullName}`), writeText);
    console.log('writeText',writeText);
    return writeText;
  } catch (error) {
    console.log('文件写入错误：', error);
    return false;
  }
}

exports.jsonToString = (obj, skipBasicObj, level = 0) => {
  const getLevelSpaces = (level) => Array(level * 2).fill(' ').join('');
  const isBasicType = (item) => item === null || typeof item !== 'object';
  if (obj === null || obj === undefined) return 'null';
  if (typeof obj === 'string') return '"' + obj.replace(/"/g, '\\"') + '"';
  if (typeof obj !== 'object') return obj.toString();
  if (Array.isArray(obj)) {
    // 间隔
    if (obj.every(item => isBasicType(item))) return '[' + obj.map(i => this.jsonToString(i)).join(',') + ']';
    return '[\n' + getLevelSpaces(level + 1) + obj.map(item => this.jsonToString(item, skipBasicObj, level + 1)).join(',\n' + getLevelSpaces(level + 1)) + '\n' + getLevelSpaces(level) + ']';
  }
  const entries = Object.entries(obj).filter(value => value[1] !== undefined);
  if (entries.length === 0) return '{}';
  if (skipBasicObj && entries.every(value => isBasicType(value[1]))) {
    return '{' + entries.map(value => '"' + value[0] + '": ' + this.jsonToString(value[1], skipBasicObj)).join(', ') + '}';
  }
  return '{\n' + getLevelSpaces(level + 1) + entries.map(value => '"' + value[0] + '": ' + this.jsonToString(value[1], skipBasicObj, level + 1)).join(',\n' + getLevelSpaces(level + 1)) + '\n' + getLevelSpaces(level) + '}';
}