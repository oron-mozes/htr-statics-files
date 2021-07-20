import {myFunction} from './TestImportB.js';

(() => {
console.log('Module is in the house..')
myFunction();
})()

window.__wixWebComponentRender__ = {
  WixHTMLElement: class extends HTMLElement {

    render() {
      console.log('Loaded class!!!!!')
    }
  }
}

window.dispatchEvent(new CustomEvent('__wixWebComponentRender__.ready'))