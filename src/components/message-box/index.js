import { h, Component } from "preact";
import styles from "./styles.scss";

export default class App extends Component {
  constructor(props) {
    super(props)

    this.socket = props.socket;
    this.state = {
      messageText: null
    }
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    const msg = this.messageText.value;

    this.socket.emit('chat message', msg);
    this.props.onSend(msg)

    this.setState({
      messageText: null
    })
  }

  render(props, state) {
    return (
      <div class='melior-chatbox__message-box'>
        <form onSubmit={this.handleSubmit}>
          <input 
            name='message-text'
            id='message-text'
            value={state.messageText}
            ref={ref => this.messageText = ref } />
          <input type='submit' value='Send' />
        </form>
      </div>
    );
  }
}
