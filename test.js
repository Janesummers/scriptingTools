document.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
         console.log('keydown', window.getSelection().anchorNode.data, window.getSelection().extentNode.data, window.getSelection().toString())   
    }
})


// 默认
// x={}
// a.split('\n\n').forEach(item => {
//     let temp = item.split('\n')
//     let link = new URL(temp[1])
//     let linkConfig = link.pathname ? link.pathname.split('/').filter(item => item) : []
//     let search = link.search
//     let title = temp[0]
//     if (linkConfig.length) {
//         let type = linkConfig[0]
//         let code = linkConfig[1]
//         if (x[type]) {
//             x[type][code] = { code: code, title: title, link: `/${type}/${code}${search || ''}` }
//         } else {
//             x = {
//                 [type]: { [code]: { code: code, title: title, link: `/${type}/${code}${search || ''}` } }
//             }
//         }
//     }
// })

// tags
// x={}
// a.split('\n\n').forEach(item => {
//     let temp = item.split('\n')
//     let link = new URL(temp[1])
//     let linkConfig = link.pathname ? link.pathname.split('/').filter(item => item) : []
//     let search = link.search
//     let title = temp[0]
//     if (linkConfig.length) {
//         let type = linkConfig[0]
//         let code = search
//         if (x[type]) {
//             x[type][code] = { code: code, title: title, link: `/${type}/${code}${search || ''}` }
//         } else {
//             x = {
//                 [type]: { [code]: { code: code, title: title, link: `/${type}/${code}${search || ''}` } }
//             }
//         }
//     }
// })

// search
// x={}
// a.split('\n\n').forEach(item => {
//     let temp = item.split('\n')
//     let link = new URL(temp[1])
//     let linkConfig = link.pathname ? link.pathname.split('/').filter(item => item) : []
//     let search = link.search
//     let title = new URLSearchParams(search).get('q')
//     if (linkConfig.length) {
//         let type = linkConfig[0]
//         let code = title
//         if (x[type]) {
//             x[type][code] = { code: code, title: title, link: `/${type}/${search || ''}` }
//         } else {
//             x = {
//                 [type]: { [code]: { code: code, title: title, link: `/${type}/${search || ''}` } }
//             }
//         }
//     }
// })
