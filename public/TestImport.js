
window.__wixWebComponentRender__ = {

  WixHTMLElement: class extends HTMLElement {
    state = {};
    #wixConfig;

    constructor(_state = {}) {
      super();
      this.setAttribute('style', 'display:block')
      this.state = _state;
      this.#initialDraw();
    }
    connectedCallback() {
      const wixconfig = JSON.parse(this?.attributes?.wixconfig?.value || '{}');
      this.updateState(wixconfig)
    }
    getFromConfig(key) {
        return this.#wixConfig[key];
    }
    updateState(newState) {
      this.state = {...this.state, ...newState};
      this.#draw();
    }
    render() {
      return "";
    }
    #initialDraw () {
      const jsx = this.render()
      this.appendChild(new DOMParser().parseFromString(jsx, 'text/html').body.firstChild);
    }
    #draw () {
      const jsx = this.render()
      this.replaceChild(new DOMParser().parseFromString(jsx, 'text/html').body.firstChild, this.firstChild);
    }

  }
}

window.dispatchEvent(new CustomEvent('__wixWebComponentRender__.ready'))