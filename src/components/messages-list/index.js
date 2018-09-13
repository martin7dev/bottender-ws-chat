import { h, Component } from "preact";
import styles from "./styles.scss";

export default class App extends Component {
  constructor(props) {
    super(props)
    // TODO use context.
    this.socket = props.socket
    this.state = {
      messages: []
    }
  }

  componentDidMount() {
    this.socket.on('bot response', (msg) => {
      this.setState({
        messages: this.state.messages.concat({ text: msg, type: 'reply' })
      })
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      messages: this.state.messages.concat({ text: nextProps.sentMessage, type: 'message' })
    })
  }

  renderMessages = () => {
    return (
      <ul className={styles.messages_list}>
        {
          this.state.messages.map(msg => {
            if (msg.type === 'message') {
              return <li className={styles.message_self}>{msg.text}</li>
            } else {
              return <li className={styles.message_reply}>{msg.text}</li>
            }
          })
        }
      </ul>
    )
  }
  
  render(props, state) {
    return (
      <div className={styles.messages}>
        { this.renderMessages() }
      </div>
    );
  }
}
