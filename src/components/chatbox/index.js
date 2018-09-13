import { h, Component } from "preact";
import io from 'socket.io-client';

import styles from "./styles.scss";

import MessagesList from '../messages-list';
import MessageBox from '../message-box';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.socket = io(props.serverUrl);
    this.state = {
      sentMessage: null
    }
  }

  handleSend = (msg) => {
    this.setState({ sentMessage: msg })
  }

  render(props, state) {
    return (
      <div class='melior-chatbox'>
        <MessagesList socket={this.socket} sentMessage={state.sentMessage} />
        <MessageBox socket={this.socket} onSend={this.handleSend.bind(this)} />
      </div>
    );
  }
}
