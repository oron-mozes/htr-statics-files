
window.__wixWebComponentRender__ = {

  WixHTMLElement: class extends HTMLElement {
    state = {};
    #appToken;

    constructor(_state = {}) {
      super();
      this.setAttribute('style', 'display:block')
      this.state = _state;
      this.#initialDraw();
    }

    async getAppToken() {
      if(this.#appToken) {
        return Promise.resolve(this.#appToken)
      }
      return new Promise((resolve, reject) => {
        this.addEventListener('app-token', ({token}) => {
          this.removeEventListener('app-token');
          this.#appToken = token;
          resolve(this.#appToken)
        })
        this.dispatchEvent(new CustomEvent('get-app-token', this.state.appId));
      })
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