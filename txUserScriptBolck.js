// ==UserScript==
// @name         JSummer - 糖心 - 万花筒
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.txh049.com/movie/block/*
// @match        https://txh049.com/movie/block/*
// @resource     customCSS https://chiens.cn/recordApi/message.css
// @require      https://chiens.cn/recordApi/message.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      *
// ==/UserScript==

/* globals GM_addStyle, GM_getResourceText, GM_xmlhttpRequest, Qmsg */

// @connect * 表示允许任何域名的跨域请求

sessionStorage.setItem('dialogAd', 'sonofbitch');
sessionStorage.setItem('noticeDialog', 'sonofbitch');
sessionStorage.setItem('splashAd', 'sonofbitch');

const css = GM_getResourceText("customCSS");
const txUserConfig = {
  "91兔兔": "https://txh049.com/user/20642090",
  "91百人斩": "https://txh049.com/user/35993806",
  "驯鹿": "https://txh049.com/user/34892423",
  "米娜学姐": "https://txh049.com/user/30071772",
  "91 xx君": "https://txh049.com/user/30918357",
  "金善雅": "https://txh049.com/user/36455839",
  "米莎": "https://txh049.com/user/2372537",
  "顶级色影": "https://txh049.com/user/27238346",
  "可可幂": "https://txh049.com/user/18984830",
  "Remix": "https://txh049.com/user/18465",
  "仙仙桃": "https://txh049.com/user/9318885",
  "SG工作室": "https://txh049.com/user/375571",
  "娜美": "https://txh049.com/user/39168",
  "可爱兔": "https://txh049.com/user/20065361",
  "麻酥酥": "https://txh049.com/user/6185204",
  "私人玩物": "https://txh049.com/user/2453297",
  "星空无限传媒": "https://txh049.com/user/6015373",
  "天美传媒": "https://txh049.com/user/62726",
  "蜜桃传媒官方君": "https://txh049.com/user/865178",
  "捅主任": "https://txh049.com/user/35081590",
  "小鹿酱": "https://txh049.com/user/18603092",
  "小老虎菜": "https://txh049.com/user/35404571",
  "ED MOASIC": "https://txh049.com/user/35323641",
  "肉肉": "https://txh049.com/user/8906268",
  "荔枝": "https://txh049.com/user/19700278",
  "小九九": "https://txh049.com/user/31073792",
  "蔡鱼籽": "https://txh049.com/user/3991537",
  "龙宝": "https://txh049.com/user/31817245",
  "绿帽Sarah": "https://txh049.com/user/35099395",
  "软妹🐰": "https://txh049.com/user/31079082",
  "am女郎": "https://txh049.com/user/31152354",
  "小苏拉": "https://txh049.com/user/22510472",
  "樱狸子": "https://txh049.com/user/18705642",
  "水果派中文解说": "https://txh049.com/user/22",
  "莉娜": "https://txh049.com/user/2667103",
  "小狐狸": "https://txh049.com/user/5690206",
  "Kiki姐": "https://txh049.com/user/8669174",
  "巧克力牛奶全套": "https://txh049.com/user/21782758",
  "Una尤娜": "https://txh049.com/user/33487252",
  "小爱神": "https://txh049.com/user/34253562",
  "奶茶妹妹": "https://txh049.com/user/17128377",
  "猫宝宝": "https://txh049.com/user/21312311",
  "探花档案": "https://txh049.com/user/25644",
  "湾湾": "https://txh049.com/user/1263256",
  "Sexrita": "https://txh049.com/user/1280017",
  "月月": "https://txh049.com/user/33332946",
  "Dom.窒息": "https://txh049.com/user/5629016",
  "欧美快车": "https://txh049.com/user/29",
  "艾小青": "https://txh049.com/user/28506",
  "抖阴": "https://txh049.com/user/279114",
  "JVID": "https://txh049.com/user/21",
  "梨奈": "https://txh049.com/user/5603263",
  "Highsstn": "https://txh049.com/user/3273295",
  "爱丝袜的Vivian姐": "https://txh049.com/user/1301308",
  "夏晴子Candybaby": "https://txh049.com/user/33448146",
  "小辣椒": "https://txh049.com/user/5039927",
  "鹤7": "https://txh049.com/user/30063555",
  "rabbyjay": "https://txh049.com/user/19799514",
  "芋圆": "https://txh049.com/user/30826198",
  "不太皮": "https://txh049.com/user/32741525",
  "星奈酱sena": "https://txh049.com/user/27744617",
  "糖宝": "https://txh049.com/user/5",
  "Alleys": "https://txh049.com/user/1345474",
  "D先生": "https://txh049.com/user/20739769",
  "Applecptv": "https://txh049.com/user/32907095",
  "大B哥": "https://txh049.com/user/20816635",
  "芽芽酱": "https://txh049.com/user/27920488",
  "FC2": "https://txh049.com/user/12573881",
  "絲姬": "https://txh049.com/user/16034819",
  "空姐派": "https://txh049.com/user/43",
  "糖公馆": "https://txh049.com/user/18186736",
  "Rolakik": "https://txh049.com/user/2736813",
  "唐伯虎": "https://txh049.com/user/15115285",
  "Nicolove妮可": "https://txh049.com/user/8231990",
  "糖心锅锅酱": "https://txh049.com/user/26049856",
  "岛国梦工厂": "https://txh049.com/user/47",
  "技术大湿": "https://txh049.com/user/40015",
  "次元君": "https://txh049.com/user/8249320",
  "鸡蛋饼": "https://txh049.com/user/17102064",
  "水蜜桃": "https://txh049.com/user/12147199",
  "悍匪先生": "https://txh049.com/user/27893190",
  "粉色情人": "https://txh049.com/user/13443490",
  "TokyoDiary Vivienne": "https://txh049.com/user/3417233",
  "樂樂": "https://txh049.com/user/9212909",
  "福利番": "https://txh049.com/user/68019",
  "咕噜全套合集": "https://txh049.com/user/22588969",
  "司雨": "https://txh049.com/user/3416992",
  "lingxi": "https://txh049.com/user/9578279",
  "猛料情报局": "https://txh049.com/user/51",
  "91教父": "https://txh049.com/user/26772428",
  "多乙": "https://txh049.com/user/5525143",
  "小橘妹妹": "https://txh049.com/user/29391535",
  "小猫": "https://txh049.com/user/5742566",
  "小桃酱": "https://txh049.com/user/15204059",
  "早川学姐": "https://txh049.com/user/24172212",
  "CC": "https://txh049.com/user/5704536",
  "小云云": "https://txh049.com/user/5216615",
  "小余baby": "https://txh049.com/user/19790161",
  "橘子猫": "https://txh049.com/user/7891022",
  "三寸萝莉": "https://txh049.com/user/5688249",
  "樱井奈奈": "https://txh049.com/user/1263621",
  "AI工作室": "https://txh049.com/user/26697635",
  "侦察俄罗斯": "https://txh049.com/user/30",
  "动漫Hot": "https://txh049.com/user/179330",
  "甜味白兔": "https://txh049.com/user/27894261",
  "西门庆": "https://txh049.com/user/17425788",
  "naomiii517": "https://txh049.com/user/8528269",
  "糖心淑怡": "https://txh049.com/user/21218180",
  "91秀": "https://txh049.com/user/26",
  "甜心宝贝": "https://txh049.com/user/11955851",
  "糖心官方君": "https://txh049.com/user/32581",
  "铃木君": "https://txh049.com/user/17841172",
  "伊丽莎有点白": "https://txh049.com/user/7322629",
  "董小姐": "https://txh049.com/user/6333010",
  "Yua🐹": "https://txh049.com/user/30072054",
  "Yuzukitty柚子猫": "https://txh049.com/user/3273096",
  "伊娃": "https://txh049.com/user/17278304",
  "小七软同学": "https://txh049.com/user/7322861",
  "小阿俏": "https://txh049.com/user/6185249",
  "91丽江夫妻": "https://txh049.com/user/23726197",
  "萌白酱": "https://txh049.com/user/27",
  "情深叉喔": "https://txh049.com/user/74518052",
  "饼干姐姐": "https://txh049.com/user/67607319",
  "Nana_taipei": "https://txh049.com/user/30110215",
  "小欣奈": "https://txh049.com/user/74068627",
  "会洗澡的桃子": "https://txh049.com/user/85424017",
  "兔兔学姐": "https://txh049.com/user/83776965",
  "苏小涵": "https://txh049.com/user/83105665",
  "水冰月": "https://txh049.com/user/77957477",
  "桥本香菜": "https://txh049.com/user/56127895",
  "反差婊基地": "https://txh049.com/user/81984043",
  "冠希原创": "https://txh049.com/user/84383873",
  "糖心软软兔": "https://txh049.com/user/81939846",
  "好色星球": "https://txh049.com/user/86554446",
  "懒懒猪": "https://txh049.com/user/80088394",
  "精主TV": "https://txh049.com/user/76836572",
  "安琪罗拉": "https://txh049.com/user/85427681",
  "赤木晴子": "https://txh049.com/user/85428139",
  "樱空桃桃": "https://txh049.com/user/68983764",
  "北野爱": "https://txh049.com/user/84287904",
  "黑椒盖饭": "https://txh049.com/user/73638167",
  "鸡教练": "https://txh049.com/user/61169047",
  "桃乃沐香奈": "https://txh049.com/user/75542892",
  "芋泥啵啵": "https://txh049.com/user/72839539",
  "啵啵小兔": "https://txh049.com/user/73027379",
  "小敏儿": "https://txh049.com/user/60007367",
  "Misa酱": "https://txh049.com/user/81362855",
  "黑宫": "https://txh049.com/user/4986",
  "雅雅": "https://txh049.com/user/78435696",
  "默默是olive呀": "https://txh049.com/user/34253562",
  "nuomibaby": "https://txh049.com/user/80825974",
  "创可贴贴": "https://txh049.com/user/78351370",
  "西野加奈": "https://txh049.com/user/71665274",
  "小二先生": "https://txh049.com/user/27065755",
  "黑猫露娜酱": "https://txh049.com/user/69420282",
  "小条": "https://txh049.com/user/79924840",
  "Make性专家": "https://txh049.com/user/71718475",
  "Only one": "https://txh049.com/user/69668338",
  "王红妈妈": "https://txh049.com/user/73102984",
  "小熊奈奈": "https://txh049.com/user/81673883",
  "二代cc": "https://txh049.com/user/71318322",
  "佐美": "https://txh049.com/user/80455337",
  "花菜": "https://txh049.com/user/72305084",
  "梅川": "https://txh049.com/user/69420288",
  "橙子哥": "https://txh049.com/user/81193952",
  "GZ小刚炮": "https://txh049.com/user/80222518",
  "米菲兔": "https://txh049.com/user/67195627",
  "开妓院的奶崽": "https://txh049.com/user/82289294",
  "91渣男": "https://txh049.com/user/25230118",
  "cc甜心": "https://txh049.com/user/77468017",
  "S百人斩": "https://txh049.com/user/77320698",
  "哆彩次元": "https://txh049.com/user/81393849",
  "奶桃": "https://txh049.com/user/74665336",
  "狮子座": "https://txh049.com/user/80825983",
  "绿箭侠": "https://txh049.com/user/80992052",
  "仓井满": "https://txh049.com/user/66344423",
  "YaYa伢伢": "https://txh049.com/user/79464925",
  "鹤酱": "https://txh049.com/user/57763014",
  "唐可可": "https://txh049.com/user/40002726",
  "奶兔": "https://txh049.com/user/78574943",
  "双喜": "https://txh049.com/user/71386982",
  "皇家华人": "https://txh049.com/user/72755835",
  "Chloe": "https://txh049.com/user/33086089",
  "一条肌肉狗": "https://txh049.com/user/71665273",
  "皮总": "https://txh049.com/user/74697436",
  "美杜莎": "https://txh049.com/user/58569291",
  "丝袜猫": "https://txh049.com/user/69420287",
  "夏花": "https://txh049.com/user/17442888",
  "耀灵": "https://txh049.com/user/74697435",
  "戴夫": "https://txh049.com/user/73924915",
  "MIKA果粒": "https://txh049.com/user/32867826",
  "M-N（海外党）": "https://txh049.com/user/73156486",
  "小千绪": "https://txh049.com/user/71665272",
  "ssrpeach": "https://txh049.com/user/73713360",
  "bmt": "https://txh049.com/user/72301332",
  "棍之炼精术士": "https://txh049.com/user/74697434",
  "东方巨龙": "https://txh049.com/user/72755830",
  "Veronica小猫咪": "https://txh049.com/user/68676270",
  "酥酥": "https://txh049.com/user/40615480",
  "御梦子 🍒": "https://txh049.com/user/57734092",
  "爱豆传媒": "https://txh049.com/user/60019508",
  "金颜希": "https://txh049.com/user/71269222",
  "萌崽儿": "https://txh049.com/user/71665275",
  "小爱童鞋": "https://txh049.com/user/17240209",
  "金善雅": "https://txh049.com/user/36455839",
  "SLRabbit": "https://txh049.com/user/67195620",
  "侦查俄罗斯": "https://txh049.com/user/30",
  "仙仙桃": "https://txh049.com/user/9318885",
  "菠萝酱吖": "https://txh049.com/user/40592965",
  "奶凶大人": "https://txh049.com/user/69420284",
  "铃木君": "https://txh049.com/user/17841172",
  "糖仁MCN": "https://txh049.com/user/16007475",
  "糖仁mcn-师师": "https://txh049.com/user/67195624",
  "玩偶姐姐": "https://txh049.com/user/3417449",
  "下面有根棒棒糖": "https://txh049.com/user/2956064",
}
// const dataSource = GM_getResourceText("dataSource");
GM_addStyle(css);
// GM_addStyle(`
// a[checked]::before {
//   content: '[已看]';
//   font-size: 23px;
// }
// `);

// let sheet = style.sheet;
// sheet.addRule('a:visited', 'color: #b58226 !important;');
// // sheet.addRule('#main a', 'font-size: 14px;font-weight: 800;');
// sheet.addRule('input', 'color: #6c6c6c !important;');
    
var style = document.createElement('style');
document.head.appendChild(style);
let sheet = style.sheet;
const cssList = [
  { label: 'div[checked]', value: 'color: #b58226 !important;' }
]
cssList.map(item => {
  if (sheet.insertRule) {
    sheet.insertRule(`${item.label} { ${item.value} }`);
  } else {
    sheet.addRule(`${item.label} { ${item.value} }`);
  }
})
let isRecord = false
let isLoading = false

console.log('等待脚本执行');

let codeList = []
let globalHint = null
let scrollHeight = 0;
let userCode = location.pathname.match(/(\d{2,})/)[0]

function initTitle () {
  console.log('909090');
  // document.querySelector('.video-info .title')
  // let title = pathname.includes('/video/detail') ? document.querySelector('.video-info .title') : document.querySelector('.nickname')
  let title = document.querySelector('.nickname')
  if (title && !document.title.includes(title.innerText.trim())) {
    // document.title = `${title.innerText.trim()} -糖心`
    document.title = new URLSearchParams(window.location.search).get("title")
    getListHandle()
    customBtn()
    // document.querySelector('.my-swipe.ad.van-swipe').remove()
  } else {
    setTimeout(initTitle, 1000)
  }
}

function listHandle() {
  globalHint.close()
  globalHint = Qmsg.success("请求成功，等待页面加载完成", {autoClose: false, onClose: () => {  }});
  let child = document.querySelector('.video-list').querySelectorAll('.video-item')
  if (child.length > 0) {
    const box = document.querySelector('.video-list')
    box.addEventListener('DOMNodeInserted', function(){
      const currentHeight = document.getElementsByClassName('video-list')[0].scrollHeight;
      if (scrollHeight !== 0 && currentHeight > (scrollHeight + 50)) {
        getListHandle()
      }
    }, false);
      
    for (let i = 0; i < child.length; i++) {
      let item = child[i]
      // console.log('item', item.getAttribute('id'))
      item.querySelector('.aspect-ratio').setAttribute('title', item.querySelector('.info .title').innerText)
      item.querySelector('.aspect-ratio').style.position = 'relative'
      let userName = item.querySelector('.info .user .nickname').innerText.trim()
      if (txUserConfig[userName] && !item.querySelector('.aspect-ratio').getAttribute('check')) {
        item.querySelector('.aspect-ratio').setAttribute('check', '1')
        let btn = document.createElement('div') 
        btn.class = 'js-custom-btn-to-url'
        btn.innerText = 'Go'
        btn.style.width = '120px'
        btn.style.height = '40px'
        btn.style.fontSize = '20px'
        btn.style.textAlign = 'center'
        btn.style.lineHeight = '40px'
        btn.style.backgroundColor = 'rgb(25, 137, 250)'
        btn.style.borderRadius = '6px'
        btn.style.position = 'absolute'
        btn.style.right = '0'
        btn.style.top = '0'
        btn.style.zIndex = '2000'
        btn.style.cursor = 'pointer'
        btn.style.color = '#fff'
        btn.addEventListener('click', () => {
          Qmsg.success("okk", {autoClose: true});
          window.open(txUserConfig[userName])
        })
        item.querySelector('.aspect-ratio').appendChild(btn)
      }


      // item.querySelector('.aspect-ratio').addEventListener('click', function(){
      //     // console.log('123', this)
      //     // userCode = document.querySelector('.nav-content').href.match(/(\d{5,})/)
      //     recordText(this.getAttribute('title'))
      //     // if (this.querySelector('.info .title').getAttribute('checked')) {
              
      //     // } else {
      //     //     this.querySelector('.info .title').setAttribute('checked','')
      //     // }
      // }, false)
      // item.querySelector('.info .title').addEventListener('click', function(){
      //     // console.log('123', this)
      //     // userCode = document.querySelector('.nav-content').href.match(/(\d{5,})/)
      //     recordText(this.innerText)
      //     this.setAttribute('checked','1')
      //     // if (this.querySelector('.info .title').getAttribute('checked')) {
              
      //     // } else {
      //     //     this.querySelector('.info .title').setAttribute('checked','')
      //     // }
      // }, false)
      if (codeList.length) {
        const text = item.querySelector('.info .title').innerText
        for (let n = 0; n < codeList.length; n++) {
          if(codeList[n].includes(text)) {
            item.querySelector('.info .title').setAttribute('checked','1')
            break
          }
        }
      }
    }
    globalHint.close()
    globalHint = Qmsg.success("处理完成", {autoClose: true, onClose: () => {  }});
    document.querySelector('.video-list').setAttribute('checkedList', '1')
    isLoading = false
    scrollHeight = document.querySelector('.video-list').scrollHeight
  } else {
    globalHint.close()
    if (document.querySelector('.van-list__finished-text .empty')) {
      globalHint = Qmsg.error("处理失败，未发布视频", {autoClose: true, onClose: () => {  }});
      return
    }
    globalHint = Qmsg.error("处理失败，未获得子元素", {autoClose: true, onClose: () => {  }});
    setTimeout(() => {
      listHandle()
    }, 1000);
  }
}

function getListHandle() {
  if (isLoading) return
  if (codeList.length > 0) {
    listHandle()
    return
  }

  // let xx = document.querySelector('.video-list').querySelectorAll('.video-item')[0].innerHTML

  // GM_xmlhttpRequest({
  //   method: "get",
  //   url: "https://chiens.cn/getText/1O37c",
  //   data: '',
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded"
  //   },
  //   onload: function(req){
  //     console.log('dd', req)
  //     const result = JSON.parse(req.response)
  //     if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
  //       GM_xmlhttpRequest({
  //         method: "post",
  //         url: "https://chiens.cn/getText/write?id=1O37c",
  //         data: `data=${xx}`,
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded"
  //         },
  //         onload: function(req2){
  //           console.log('dd', req2)
  //           Qmsg.success("即将拷贝成功", {autoClose: true});
  //           const result2 = JSON.parse(req2.response)
  //           if (req2.readyState === 4 && req2.status === 200 && result2.code === 'ok') {
  //             //hint.close()
  //             Qmsg.success("拷贝成功", {autoClose: true});
  //           }
  //         },
  //         onerror: function(){
  //           Qmsg.error("拷贝失败", {autoClose: true });
  //         }
  //       });
  //     }
  //   },
  //   onerror: function(){
  //     Qmsg.error("拷贝失败", {autoClose: true });
  //   }
  // });

  isLoading = true
  globalHint = Qmsg.info("正在发请求", {autoClose: false});
  GM_xmlhttpRequest({
    method: "get",
    url: "https://chiens.cn/recordApi/tx_log.json",
    data: '',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },

    onload: (req) => {
      const result = JSON.parse(req.response)
      if (req.readyState === 4 && req.status === 200) {
        const list = Object.values(result)
        codeList = list || []
        console.log('ddsss', list)
        listHandle()
      }
    },
    onerror: (response) => {
      globalHint.close()
      isLoading = false
      Qmsg.error("请求失败", {autoClose: true });
    }
  });
}

function recordText(title) {
  if (isRecord) return
  isRecord = true
  // let userCode = ''
  // let title = ''
  
  // if (document.querySelector('.nav-content')) {
  //   userCode = document.querySelector('.nav-content').href.match(/(\d{5,})/)
  // }
  // if (document.querySelector('.introduction .name')) {
  //   title = document.querySelector('.introduction .name').innerText
  // }
  if (userCode && title !== '') {
    console.log('发请求')
    globalHint = Qmsg.info("正在发请求", {autoClose: false});
    GM_xmlhttpRequest({
      method: "post",
      url: "https://chiens.cn/recordApi/txLog",
      data: `userCode=${userCode}&title=${title}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(req){
        console.log('dd', req)
        const result = JSON.parse(req.response)
        if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
          console.log("记录成功");
          //hint.close()
          Qmsg.success("成功记录", {autoClose: true, onClose: () => { globalHint.close() }});
          isRecord = false
          // let text = localStorage.getItem('codeLog')
          // if (result.message) {
          //     if (text) {
          //         localStorage.setItem('codeLog', `${text},${code}`)
          //     } else {
          //         console.log('11', result.message)
          //         localStorage.setItem('codeLog', result.message)
          //     }
          // }
        }
      },
      onerror: function(){
        Qmsg.error("请求失败", {autoClose: true });
      }
    });
  } else {
    // setTimeout(recordText, 1000)
  }
}

function handleScroll () {
  if (location.pathname.indexOf('/block') !== -1) {
    if (!document.querySelector('.video-list').getAttribute('checkedList')) {
      document.querySelector('.video-list').setAttribute('checkedList', '1')
      getListHandle()
    }
  }
  // const currentHeight = document.getElementsByClassName('video-list')[0].scrollHeight;
  // if (currentHeight > (scrollHeight + 50)) {
  //   getListHandle()
  // }
  // console.log('【滚动条高度】', scrollHeight);
  /*scrollTop + ch = sh*/
}
window.addEventListener('scroll', handleScroll, false)

initTitle()

function customBtn() {
  let btn = document.createElement('div')
  btn.class = 'js-custom-btn'
  btn.innerText = '获取数据'
  btn.style.width = '120px'
  btn.style.height = '40px'
  btn.style.fontSize = '20px'
  btn.style.textAlign = 'center'
  btn.style.lineHeight = '40px'
  btn.style.backgroundColor = 'rgb(25, 137, 250)'
  btn.style.borderRadius = '6px'
  btn.style.position = 'fixed'
  btn.style.left = '20px'
  btn.style.bottom = '100px'
  btn.style.zIndex = '2000'
  btn.style.cursor = 'pointer'
  btn.addEventListener('click', () => {
    getDataHandle()
  })
  document.body.appendChild(btn)
}

function getDataHandle() {
  // let test = document.querySelector('.ybd_video_slide_d_ownItem_btn') ? document.querySelector('.ybd_video_slide_d_ownItem_btn').getAttribute('data-ourl') : document.querySelector('.ybd_video_slide_d_ownItem_copybtn').getAttribute('data-ourl')
  let test = document.querySelector('.vjs-tech').getAttribute('src')
  let test2 = document.querySelector('.introduction .name') ? document.querySelector('.introduction .name').innerText : document.querySelector('.info-actions .info .title').innerText
  let test3 = document.querySelector('.nav-content .info .username') ? document.querySelector('.nav-content .info .username').innerText : document.querySelector('.video-info .info .nickname').innerText
  Qmsg.info(`${test3}-${test}-${test2}`, {autoClose: true});
  // await navigator.clipboard.writeText(test)
  // Qmsg.success("准备拷贝", {autoClose: true});
  // Qmsg.success(`body-${document.querySelector('body')}`, {autoClose: true});
  // let aaa = document.querySelector('.vjs-tech').getAttribute('src')
  
  GM_xmlhttpRequest({
    method: "get",
    url: "https://chiens.cn/getText/1O37c",
    data: '',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    onload: function(req){
      console.log('dd', req)
      const result = JSON.parse(req.response)
      if (req.readyState === 4 && req.status === 200 && result.code === 'ok') {
        GM_xmlhttpRequest({
          method: "post",
          url: "https://chiens.cn/getText/write?id=1O37c",
          data: `data=${result.data}\n\n${window.origin}${test}\n【${test3.trim()}】${test2}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          onload: function(req2){
            console.log('dd', req2)
            // Qmsg.success("即将拷贝成功", {autoClose: true});
            const result2 = JSON.parse(req2.response)
            if (req2.readyState === 4 && req2.status === 200 && result2.code === 'ok') {
              //hint.close()
              Qmsg.success("拷贝成功", {autoClose: true});
            }
          },
          onerror: function(){
            Qmsg.error("拷贝失败", {autoClose: true });
          }
        });
      }
    },
    onerror: function(){
      Qmsg.error("拷贝失败", {autoClose: true });
    }
  });
}
