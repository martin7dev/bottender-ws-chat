import { h, render } from "preact";

import Widget from "./components/chatbox";

render((
   <Widget serverUrl="http://localhost:3000" />
), document.body);