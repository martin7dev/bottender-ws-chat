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
      visible: false,
      sentMessage: null,
      messages: []
    }

    this.handleSend = this.handleSend.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.openChat = this.openChat.bind(this);
    this.closeChat = this.closeChat.bind(this);
  }

  handleSend (msg) {
    this.setState({
      messages: this.state
        .messages
        .concat({ 
          content: msg, 
          type: 'message'
      })
    })
  }

  handleMessage (msg) {
    this.setState({
      messages: this.state
        .messages
        .concat({ 
          content: typeof(msg) === 'string' ? msg : msg.content,
          type: typeof(msg) === 'string' ? 'reply' : msg.type,
        })
    })
  }

  openChat () {
    this.setState({ visible: true })
  }

  closeChat () {
    this.setState({ visible: false })
  }

  render(props, state) {
    return state.visible ?
      (
        <div className={styles.chat_box}>
          <button
            className={styles.close_button}
            onClick={this.closeChat}>
            Close chat
          </button>
          <MessagesList 
            socket={this.socket}
            messages={this.state.messages}
            handleMessage={this.handleMessage} />
          <MessageBox socket={this.socket} onSend={this.handleSend} />
        </div>
      ) : (
        <button
          className={styles.open_button}
          onClick={this.openChat}>
          Open chat
        </button>
      )
  }
}
