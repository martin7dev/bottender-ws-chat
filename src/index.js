import { h, render } from "preact";
import Widget from "./components/chatbox";

const defaults = {
  containerId: 'bottender-chat-mount',
  serverUrl: 'http://localhost:3000'
}

function renderWidget (opts) {
  render((
    <Widget serverUrl={opts.serverUrl} />
  ), document.getElementById(opts.containerId));
}

var BottenderWsChat = {
  init(opts) {
    const options = Object.assign(defaults, opts)
    console.log(options)

    renderWidget(options)
  }
}

window.BottenderWsChat = BottenderWsChat

export default BottenderWsChat