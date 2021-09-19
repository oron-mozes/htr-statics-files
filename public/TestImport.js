
window.__wixWebComponentRender__ = {

  WixHTMLElement: class extends HTMLElement {
    state = {};
    #wixConfig;
    report;
    constructor(_state = {}) {
      super();
      this.setAttribute('style', 'display:block')
      this.state = _state;
      this.#initialDraw();
    }
    connectedCallback() {
      const wixconfig = JSON.parse(this?.attributes?.wixconfig?.value || '{}');
      this.updateState(wixconfig);
      this.report = (type, payload) => {
        this.dispatchEvent(new CustomEvent(type, payload));
      }
      setInterval(() => {
        console.log('CALLLLL!!!!!1111111')
        this.report('web-component-event', {detail:{page: 'my-page-component11111'}});
      }, 2000);
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