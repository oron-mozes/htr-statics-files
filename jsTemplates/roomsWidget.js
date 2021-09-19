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
function addInstance() {
  return 'instanceId={{instanceId}}';
}

function load() {
  const baseUrl = 'https://htr-staticfiles.herokuapp.com/_api/rooms'
  
  class MyWidgetNavigateToWebComp extends __wixWebComponentRender__.WixHTMLElement {
    constructor() {
      super({test: 'hello', rooms: []});
      if(!window.wixDevelopersAnalytics) {
        window.addEventListener('wixDevelopersAnalyticsReady', () =>  window.wixDevelopersAnalytics.register('my-widget-notify-component', this.getEvents))
      } else {
        window.wixDevelopersAnalytics.register('my-widget-component', this.getEvents)
      }
     
      fetch(`${baseUrl}?${addInstance()}`).then(response => response.json()).then(roomsData => {
        this.updateState(roomsData)
      })
    }
   
    connectedCallback() {
      // this.dispatchEvent(new CustomEvent('web-component-event', {detail:{page: 'my-page-component'}}));
      // const wixconfig = JSON.parse(this?.attributes?.wixconfig?.value || '{}');
      // this.updateState(wixconfig);
      // const data = JSON.parse(unescape(this.getAttribute('data')));
      // this.updateState({room: data.room, visitorId: data.visitorId});
      // setInterval(() => {
      //   console.log('CALLLLL!!!!!')
       
      // }, 1000);
    }
    
    getEvents = (event, data) => {

      if((event === "CustomEvent" && data.eventCategory === "Site members") || event === 'PageView') {
        this.updateState(data)
      }
      if(event === "htrMessage"){
        this.updateState({data, test: 'reloaded'})
      }
    }

   
    render() {
      const {rooms} = this.state;
      return `
      <div style="display: flex;
          justify-content: center;
          flex-direction: column;
          width: 100%;
        ">
          <h1 style="text-align: center;">Our Hotel Great Rooms:</h1>
          <hr/>
          ${
            rooms.map(room =>  (`<room-view data=${escape(JSON.stringify({room, visitorId: this.state.visitorId}))}></room-view>`))
          }
      </div>`;
    }
  }
  class RoomView extends __wixWebComponentRender__.WixHTMLElement {
    constructor() {
      super({room: {}, metaSiteId: wixEmbedsAPI.getMetaSiteId()});
      // this.dispatchEvent(new CustomEvent('web-component-event', {detail:{page: 'my-page-component'}}));
    }

    getEvents = (event, data) => {
      if((event === "CustomEvent" && data.eventCategory === "Site members") || event === 'PageView') {
        this.updateState(data)
      }
    }
  
    connectedCallback() {
      this.dispatchEvent(new CustomEvent('web-component-event', {detail:{page: 'my-page-component'}}));
      // const wixconfig = JSON.parse(this?.attributes?.wixconfig?.value || '{}');
      // this.updateState(wixconfig);
      // const data = JSON.parse(unescape(this.getAttribute('data')));
      // this.updateState({room: data.room, visitorId: data.visitorId});
      // setInterval(() => {
      //   console.log('CALLLLL!!!!!')
       
      // }, 1000);
    }
  
    order = () => {
      fetch(`${baseUrl}/reserve?${addInstance()}`, 
        {
          method:'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            metaSiteId: this.state.metaSiteId,
            orderId: this.state.room.roomId,
            visitorId:this.state.visitorId
          })})
      .then(data => data.json()).then(() => {
        window.wixDevelopersAnalytics.triggerEvent('htrNewOrder')
      }).catch(e => console.error(e))
    }

    log() {
      console.log('CLICKED!!!!');
      this.dispatchEvent(new CustomEvent('navigateTo', {detail:{page: 'my-page-component'}}));
    }
    
    render() {
      const {name, description, productStatus, roomId} = this.state.room;
      if(!roomId) {
        return '<div>loading</loading>';
      }
      return `<div style="display: flex;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      margin-bottom: 50px;
    ">
        <h2>${name}</h2>
        <p>${description}</p>
        <hr/>
        <label>Available: ${productStatus}</label>
        <button onclick="this.closest('room-view').order()" 
          style="background: cadetblue;
          line-height: 200%;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 50px;"
        >Order</button>
        <button 
        style="background: chocolate;
        line-height: 200%;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;"
        id="goToPage" onclick="this.closest('room-view').log()">Show me more</button>
      </div>`
    }
  }
  customElements.define('my-widget-component', MyWidgetNavigateToWebComp);  
  customElements.define('room-view', RoomView);  
}
