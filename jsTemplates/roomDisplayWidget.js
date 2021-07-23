class MyWebCompAsPage extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
  }
  connectedCallback() {
    setTimeout(() => {
      console.log("before event");
      this.dispatchEvent(new CustomEvent('web-component-event'));
      console.log("after event");
    }, 500)
    this.dispatchEvent(new CustomEvent('web-component-event'));
    const wixconfig = JSON.parse(this?.attributes?.wixconfig?.value || '{}');
    // current instanceId
    const instanceId = wixconfig?.instanceId || '';
    console.log({wixconfig})
    this.setAttribute('style', 'display:block')
 
   this.render(wixconfig)
   
  }

  render(wixconfig) {
    this.innerHTML = `
    <div style="display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        background: #f0f8ff;
      ">
        <h1>${wixconfig.data.title || "This is a Web Component PAGE demo"}</h1>
        <button id="goToHome">Go to home page</button>
    </div>
  `;

    this.renderActions();
  }

  renderActions() {
    document.getElementById("goToHome").onclick = () => {
      this.dispatchEvent(new CustomEvent('navigateTo', {detail:{page: 'home'}}));
    }
  }

}

customElements.define('my-page-component', MyWebCompAsPage);