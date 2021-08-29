(function () {
  class Widget {
    origin: string;
    userSettings: any;
    private frame: HTMLIFrameElement;
  
    constructor() {
      this.origin = window.location.origin;
      this.userSettings = null;
      this.frame = null;
  
      console.log('init')
      console.log('origin', this.origin)
      this.init();
    }
  
    init = () => {
      // auth section
      const userSettings = {}; // get from api
      // fetch settings and pass it to initWidget
      this.initWidget(userSettings);
    }
    initWidget = (settings) => {
      // sets settings as a class property
      this.userSettings = settings;
      // create container mount point
      this.createMountPoint();
      this.loadIFrame();
      // loadJS (optional)
    }
    createMountPoint = () => {
      // create root node for iframe with default styles
      const element = document.createElement("div");
      element.id = "st-widget-container";
      // element.style.width = "100px";
      // element.style.height = "100px";
      element.style.bottom = "0px";
      element.style.position = "absolute"
      element.style.right = "0px";
      element.style.zIndex = '100000';
      element.style.width = '450px';
      element.style.height = '800px';
      // @ts-ignore
      element.setAttribute("data-html2canvas-ignore", !0); // data-html2canvas-ignore ?
      document.body.appendChild(element);
      // append styles link into head (optional)
    }
    loadIFrame = () => {
      // create iframe tag
      const element = document.createElement("iframe");
      // element.style.display = "none";
      element.setAttribute("title", "ServiceWidget");
      element.setAttribute("id", "service-widget-frame")
      // @ts-ignore
      element.setAttribute("data-html2canvas-ignore", !0)
      element.style.width = '100%';
      element.style.height = '100%';
      element.style.borderRadius = 'inherit';
      element.src = 'http://localhost:5000/'
      // @ts-ignore
      element.crossorigin = "anonymous"
  
      const destination = document.getElementById('st-widget-container')
      destination.appendChild(element);
  
      // store iframe as property this.frame
      this.frame = element;
      // subscribe for events
      if (window.addEventListener) {
        window.addEventListener("message", this.handleMessage, !0)
      } else {
        // @ts-ignore
        window.attachEvent("message", this.handleMessage, !0);
      } 
      this.onRenderCompleted()
  
    }
    handleMessage = (event) => {
      console.log('MESSAGE: ', event);
      // received postMassage with data properties
      const { eventName, data } = event.data;
      // calls method by eventName
      if (eventName &&  typeof this[eventName] === 'function') {
        this[eventName](data)
      }
    }
    onRenderCompleted = () => {
      // create queue from config
      // override Widget with helpWidgetMethods
      // @ts-ignore
      const queue = (window.ServiceWidget && window.ServiceWidget.q) || [];
       // @ts-ignore
      window.ServiceWidget = this.helpWidgetMethods;
  
      queue.forEach(function (e) {
          // @ts-ignore
          window.ServiceWidget.apply(null, e);
      })
      this.postMessage('done');
      // execute queues actions
      // post message on complete (optional)
    }
    helpWidgetMethods = (event, ...rest) => {
      console.log(this);
      // receive (eventName, ...params)
      // check if event is available from options
      // calls this with params
      this[event](rest)
    }
    postMessage = (event) => {
      // checks arguments
      // const data = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      // calls postMassage on frame with origin
      this.frame.contentWindow.postMessage({ eventName: event.eventName }, 'http://localhost:5000');
    }
    open = () => {
      console.log('OPEN', this.frame)
      // this.frame.contentWindow.Widget.mount('http://localhost:5000 ');
      // call postMessage with open event
      this.postMessage('open')
    }
    hide = () =>  {
      console.log('HIDE', this.frame)
      // call postMessage with hide event
    }
  }
  new Widget();
})();