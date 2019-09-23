const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 * formatDate(new Date(), 'yyyy-MM-dd 第q季度 www HH:mm:ss:SSS');  2016-09-02 第3季度 星期五 13:19:15:792
 */
function formatDate(date = new Date(), fmt = 'yyyy-MM-dd HH:mm:ss') {
  // date = date ? new Date() : date
  // fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
  date = typeof date == 'number' ? new Date(date) : date;
  var obj = {
    'y': date.getFullYear(), // 年份，注意必须用getFullYear
    'M': date.getMonth() + 1, // 月份，注意是从0-11
    'd': date.getDate(), // 日期
    'q': Math.floor((date.getMonth() + 3) / 3),
    'w': date.getDay(), // 星期，注意是0-6
    'H': date.getHours(), // 24小时制
    'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
    'm': date.getMinutes(), // 分钟
    's': date.getSeconds(), // 秒
    'S': date.getMilliseconds() // 毫秒
  };
  var week = ['天', '一', '二', '三', '四', '五', '六'];
  for (var i in obj) {
    fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
      var val = obj[i] + '';
      if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
      for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
      return m.length == 1 ? val : val.substring(val.length - m.length);
    });
  }
  return fmt;
}

function handleImgUrl (obj, imgKey) {
  if(obj instanceof Array) {
    obj.forEach(v => {
      if (v[imgKey] !== undefined) {
        v[imgKey] = 'https://sping-cloud-fall.oss-cn-shanghai.aliyuncs.com/wlhn/' + v[imgKey]
      }
    })
  }else if (obj instanceof Object) {
    if (obj[imgKey] !== undefined) {
      obj[imgKey] = 'https://sping-cloud-fall.oss-cn-shanghai.aliyuncs.com/wlhn/' + v[imgKey]
    }
  }else {
    
  }
}

function addDate(datestr, days = 1) {
  var date = datestr
  if (datestr instanceof String) {
    date = new Date(datestr);
  }

  date.setDate(date.getDate() + days);
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month
  }
  var day = date.getDate()
  if (day < 10) {
    day = '0' + day
  }
  return date.getFullYear() + '-' + month + '-' + day
}

function RandomUUID() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

function ImgPathToBase64(imgPath, callback) {
  wx.getFileSystemManager().readFile({
    filePath: imgPath, //选择图片返回的相对路径
    encoding: 'base64', //编码格式
    success: res => { //成功的回调
      callback(res.data)
    },
    fail: function (err) {
      console.log(err)
    }
  })
}

function compareDate(date1, date2) {
  let result,oDate1,oDate2

  oDate1 = new Date(date1)
  oDate2 = new Date(date2);
  const compare = oDate1.getTime() > oDate2.getTime()
  if (compare) {
    result = 1
  } else {
    result = oDate1.getTime() == oDate2.getTime() ? 0 : -1
  }
  return result
}

function callIf(func, ifFuc, maxCall) {
  if (!maxCall) {
    maxCall = 0
  }
  if (maxCall > 20) {
    return;
  }
  if(ifFuc()) {
    func()
    return; 
  }else {
    setTimeout(() => {
      callIf(func, ifFuc, ++maxCall)
    }, 300)
  }
}

/**
 * 获取url中的参数
 * @url 完整url
 * @key 参数键值
 */
function getQueryString(url, key) {
  var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
  const paramsIndex = url.indexOf('?')
  var r = url.substr(paramsIndex + 1).match(reg);
  if (r != null) {
    return unescape(r[2]);   
  }
  return null;
} 

module.exports = {
  formatTime,
  handleImgUrl,
  RandomUUID,
  ImgPathToBase64,
  formatDate,
  compareDate,
  addDate,
  callIf,
  getQueryString,
}
