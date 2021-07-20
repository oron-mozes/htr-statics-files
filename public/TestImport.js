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
      this.appendChild(jsx);
    }

  }
}

window.dispatchEvent(new CustomEvent('__wixWebComponentRender__.ready'))