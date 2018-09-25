import { h, Component } from "preact";
import styles from "./styles.scss";

export default class App extends Component {
  constructor(props) {
    super(props)

    this.socket = props.socket;
    this.state = {
      disabled: true
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleKeyUp (evt) {
    this.setState({
      disabled: evt.target.value == null || evt.target.value == '' 
    })
  }

  handleSubmit (evt) {
    evt.preventDefault();
    const msg = this.messageText.value;

    if (msg == null || msg == '') return

    this.socket.emit('chat message', { msg, location: window.location.href });
    this.props.onSend(msg)

    this.messageText.value = null;
    this.setState({
      disabled: true
    })
  }

  render(props, state) {
    return (
      <div class={styles.box}>
        <form
          className={styles.form}
          onSubmit={this.handleSubmit}>
          <input 
            className={styles.input}
            name='message-text'
            id='message-text'
            placeholder='Write a message...'
            onKeyUp={this.handleKeyUp}
            ref={i => { this.messageText = i }} />
          <input 
            className={styles.button}
            disabled={this.state.disabled}
            type='submit' value='Send' />
        </form>
      </div>
    );
  }
}
