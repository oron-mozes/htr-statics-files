import {createElement} from './TestImportB.js';

  /** @jsx createElement */
window.__wixWebComponentRender__ = {

  WixHTMLElement: class extends HTMLElement {

    constructor() {
      super();
      this.#draw();
    }

    render() {
      return "";
    }
    #draw () {
      const jsx = this.render()
      this.appendChild(new DOMParser().parseFromString(jsx, 'text/html').body.firstChild);
    }

  }
}

window.dispatchEvent(new CustomEvent('__wixWebComponentRender__.ready'))