import {createElement} from './TestImportB.js';

  /** @jsx createElement */
window.__wixWebComponentRender__ = {

  WixHTMLElement: class extends HTMLElement {
    state = {};
    constructor(_state = {}) {
      super();
      this.setAttribute('style', 'display:block')
      this.state = _state;
      this.#draw();
    }

    updateState(newState) {
      this.state = {...this.state, ...newState};
      this.#draw();
    }
    render() {
      return "";
    }
    #draw () {
      const jsx = this.render()
      this.replaceChild(new DOMParser().parseFromString(jsx, 'text/html').body.firstChild);
    }

  }
}

window.dispatchEvent(new CustomEvent('__wixWebComponentRender__.ready'))