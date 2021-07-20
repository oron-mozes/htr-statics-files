import {createElement} from './TestImportB.js';

window.__wixWebComponentRender__ = {
  /** @jsx createElement */
  WixHTMLElement: class extends HTMLElement {

    constructor() {
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