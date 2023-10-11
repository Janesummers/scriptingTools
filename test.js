document.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
         console.log('keydown', window.getSelection().anchorNode.data, window.getSelection().extentNode.data, window.getSelection().toString())   
    }
})