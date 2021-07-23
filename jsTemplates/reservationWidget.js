if (!window.__wixWebComponentRender__) {
  const moduleScript = document.createElement('script');
  moduleScript.type="module";
  moduleScript.crossorigin="anonymous";
  moduleScript.integrity="sha384-bwU02SizoFebtwa7QUsgrzrk+MsufcJz/z0BJPfJlVwH8WFmnL7WciCbX6/4Ml5I"
  moduleScript.src="https://htr-staticfiles.herokuapp.com/TestImport.js";
  document.body.append(moduleScript);
  window.addEventListener('__wixWebComponentRender__.ready', load)
} else {
  load()
}
function addInstance() {
  return 'instanceId={{instanceId}}';
}

function load() {
  const baseUrl = 'https://htr-staticfiles.herokuapp.com/_api/rooms'

  class MyWidgetThatSendsData extends __wixWebComponentRender__.WixHTMLElement {
    constructor() {
      super({orders: []});
      if(!window.wixDevelopersAnalytics) {
        window.addEventListener('wixDevelopersAnalyticsReady', () =>  window.wixDevelopersAnalytics.register('my-widget-notify-component', this.getEvents))
      } else {
        window.wixDevelopersAnalytics.register('my-widget-notify-component', this.getEvents)
      }
    }

    getEvents = (event, data) => {

      if((event === "CustomEvent" && data.eventCategory === "Site members") || event === 'PageView') {
        this.updateState(data)
        fetch(`${baseUrl}/my-orders?${addInstance()}`, 
        {
          method:'post',
          credentials: "same-origin",
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            metaSiteId: data.metaSiteId,
            visitorId:data.visitorId
          })})
      .then(data => data.json()).then((ordersData) => {
        this.updateState(ordersData)
      }).catch(e => console.error(e))
      }

      if(["htrNewOrder", 'htrRemovedOrder'].includes(event)) {
        fetch(`${baseUrl}/my-orders?${addInstance()}`, 
        {
          method:'post',
          credentials: "same-origin",
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            metaSiteId: this.state.metaSiteId,
            visitorId:this.state.visitorId
          })})
        .then(data => data.json()).then((ordersData) => {
          this.updateState(ordersData)
        }).catch(e => console.error(e))
      }
      
    }

    doCheckout = () => {
      // wixDevelopersAnalytics.triggerEvent('htrMessage', {data: {say: `The time is ${new Date().toTimeString()}`}})
    }

    render() {
     
      return `
        <div style="display: flex;
            justify-content: center;
            flex-direction: column;
            width: 100%;
            border: 1px solid grey;
            border-radius: 5px;
          ">
            <h1 style="margin-top: 5px;text-align: center;margin-bottom: 20px;">Room Reservation</h1>
            <ul style="adding: 15px;
            margin-bottom: 50px;">
            ${
              this.state.orders.map(order => {
                return (`<single-order data=${escape(JSON.stringify({orderId: order.orderId, order: order.roomDetails, metaSiteId: this.state.metaSiteId, visitorId: this.state.visitorId}))}></single-order>`)
              })
            }
            </ul>
            <button 
            style="background: cadetblue;
            line-height: 200%;
            font-size: 20px;
            margin-top: 50px;"
            onclick="this.closest('my-widget-notify-component').doCheckout()">Complete Order</button>
        </div>
      `;
    }
  }

  class MySingleOrder extends __wixWebComponentRender__.WixHTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const data = JSON.parse(unescape(this.getAttribute('data')))
      this.updateState(data)
    }

    doCheckout = () => {
      // wixDevelopersAnalytics.triggerEvent('htrMessage', {data: {say: `The time is ${new Date().toTimeString()}`}})
    }

    removeOrder = () =>  {
      fetch(`${baseUrl}/my-orders?${addInstance()}`, 
      {
        method:'delete',
        credentials: "same-origin",
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          metaSiteId: this.state.metaSiteId,
          visitorId:this.state.visitorId,
          orderId:this.state.orderId
        })})
      .then(data => data.json()).then((ordersData) => {
        window.wixDevelopersAnalytics.triggerEvent('htrRemovedOrder', {orderId: this.state.orderId})

      }).catch(e => console.error(e))
    }
    render() {
     
      const {order} = this.state;    
      if(!order) {
        return '<div>Loading</div>';
      }
      return `<li style="
      display: flex;
      justify-content: space-between;
      font-size: 15px; padding: 0 5px;">
      <label>${order.name}</label>
      <button 
      style="background: red;
      color: white;
      line-height: 200%;
      font-size: 10px;
      cursor: pointer;"
      onclick="this.closest('single-order').removeOrder()">remove</button>
      </li>`
    }
  }
  customElements.define('my-widget-notify-component', MyWidgetThatSendsData);
  customElements.define('single-order', MySingleOrder);
}