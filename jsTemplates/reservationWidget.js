if (!window.__wixWebComponentRender__) {
  const moduleScript = document.createElement('script');
  moduleScript.type="module";
  moduleScript.crossorigin="anonymous";
  moduleScript.integrity="sha384-dtML0GT2vgWevfLm52MZUKpyLSTYX6FSC9/M6Ys4cRByc2YTgHCEfjCXcVDj3l3i"
  moduleScript.src="https://htr-staticfiles.herokuapp.com/TestImport.js";
  document.body.append(moduleScript);
  window.addEventListener('__wixWebComponentRender__.ready', load)
} else {
  load()
}
const userInstance = '{{instanceId}}'
function addInstance() {
  return `instanceId=${userInstance}`;
}

function getCheckoutUrl (checkoutId) {
  var uri = {a11y:true,storeUrl:window.location.origin,isFastFlow:false,isPickupFlow:false,cashierPaymentId:"",origin:"productPage",originType:"buyNow",checkoutId};
  var query = encodeURIComponent(JSON.stringify(uri));
  
  return `/checkout?appSectionParams=${query}`
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
    connectedCallback() {
      
      const wixconfig = JSON.parse(this?.attributes?.wixconfig?.value || '{}');
      this.updateState(wixconfig)
    }
    attributeChangedCallback() {
      const wixconfig = JSON.parse(this?.attributes?.wixconfig?.value || '{}');
      this.updateState(wixconfig)
    }
    getEvents = (event, data) => {

      if((event === "CustomEvent" && data.eventCategory === "Site members") || event === 'PageView') {
        this.updateState(data)
        fetch(`${baseUrl}/my-orders?${addInstance()}`, 
        {
          method:'post',
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
    doCheckout2 = () => {
      const wixconfig = JSON.parse(this?.attributes?.wixconfig?.value || '{}');
      const authorization = window.wixEmbedsAPI.getAppToken('7cbc47b3-cfc6-4d20-a13d-40cd1521378b');
      const lineItems = this.state.orders.map(order => (
        {
          "quantity": order.quantity, 
          "description" : order.roomDetails.description, 
          "checkoutInfo": {
            "billingInfo": {
              "contactDetails": {
                "firstName": "Test",
                "lastName": "User",
                "phone": "+9720500000000",
                "company": "TestToday",
              }
            },
            "buyerInfo": {
              "email": "oronm@wix.com",
              "openAccess": true
            }
          },
          "catalogReference":
          {
            appId:'7cbc47b3-cfc6-4d20-a13d-40cd1521378b', 
            "catalogItemId": order.orderId
          },
    
      }));
      // fetch(`${baseUrl}/create-checkouts`,
      fetch('/ecom/v1/checkouts', 
        {
          method:'post',
          headers: {
            'Content-Type': 'application/json',
            authorization
          },
          body:JSON.stringify({
            lineItems,
            "channelType": "WEB"
          })})
        .then(data => data.json()).then((res) => {
          //res.checkout.id
            window.open(getCheckoutUrl(res.checkout.id), '_blank')
         
        }).catch(e => console.error(e))
      // wixDevelopersAnalytics.triggerEvent('htrMessage', {data: {say: `The time is ${new Date().toTimeString()}`}})
    }
    doCheckout = () => {
      
      const authorization = window.wixEmbedsAPI.getAppToken('7cbc47b3-cfc6-4d20-a13d-40cd1521378b');
      const lineItems = this.state.orders.map(order => (
        {
          "id": order.orderId, 
          "quantity": order.quantity, 
          "description" : order.roomDetails.description, 
          "catalogReference":
          {
            appId:'7cbc47b3-cfc6-4d20-a13d-40cd1521378b', 
            "catalogItemId": order.orderId
          },
    
      }));
      fetch(`${baseUrl}/checkout-url`,
        {
          method:'post',
          headers: {
            'Content-Type': 'application/json',
            authorization
          },
          body:JSON.stringify({
            metaSiteId: this.state.metaSiteId,
            visitorId:this.state.visitorId,
            instanceId: userInstance
          })})
        .then(data => data.json()).then((ordersData) => {
          console.log(':::ordersData::', ordersData)
        }).catch(e => console.error(e))
    }

    doCollection = () => {
      fetch(`${baseUrl}/fake-collection`,
        {
          method:'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            instanceId: userInstance
          })})
        .then(data => data.json()).then((response) => {
          console.log(':::collection::', response)
        }).catch(e => console.error(e))
    }

    doInstance = () => {
      fetch(`${baseUrl}/test-instance`,
        {
          method:'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            instanceId: userInstance
          })})
        .then(data => data.json()).then((response) => {
          console.log(':::instance ::', response)
        }).catch(e => console.error(e))
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
            onclick="this.closest('my-widget-notify-component').doCheckout2()">Complete Order</button>
            <button 
            style="background: cadetblue;
            line-height: 200%;
            font-size: 20px;
            margin-top: 50px;"
            onclick="this.closest('my-widget-notify-component').doCollection()">Fake Collection</button>
            <button 
            style="background: cadetblue;
            line-height: 200%;
            font-size: 20px;
            margin-top: 50px;"
            onclick="this.closest('my-widget-notify-component').doInstance()">fake Instance</button>
        </div>
      `;
    }
  }

  class MySingleOrder extends __wixWebComponentRender__.WixHTMLElement {
    constructor() {
      super();
    }

    connectedCallback() { 
      const wixconfig = JSON.parse(this?.attributes?.wixconfig?.value || '{}');
      this.updateState(wixconfig);
      const data = JSON.parse(unescape(this.getAttribute('data')))
      this.updateState(data)
    }

    removeOrder = () =>  {
      fetch(`${baseUrl}/my-orders?${addInstance()}`, 
      {
        method:'delete',
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