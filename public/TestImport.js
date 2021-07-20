import {myFunction} from './TestImportB.js';

(() => {
console.log('Module is in the house..')
myFunction();
})()

window.__wixWebComponentRender__ = {
  WixHTMLElement: class {

    render() {
      console.log('Loaded class!!!!!')
    }
  }
}

window.dispatchEvent('__wixWebComponentRender__.ready');