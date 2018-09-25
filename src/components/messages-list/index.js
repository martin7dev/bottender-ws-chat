import { h, Component } from "preact";
import styles from "./styles.scss";


// First, define a helper function.
function animateScroll(element, duration) {
  var start = element.scrollTop;
  var end = element.scrollHeight;
  var change = end - start;
  var increment = 20;
  function easeInOut(currentTime, start, change, duration) {
    // by Robert Penner
    currentTime /= duration / 2;
    if (currentTime < 1) {
      return change / 2 * currentTime * currentTime + start;
    }
    currentTime -= 1;
    return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
  }
  function animate(elapsedTime) {
    elapsedTime += increment;
    var position = easeInOut(elapsedTime, start, change, duration);
    element.scrollTop = position;
    if (elapsedTime < duration) {
      setTimeout(function() {
        animate(elapsedTime);
      }, increment)
    }
  }
  animate(0);
}

export default class App extends Component {
  constructor(props) {
    super(props)
    // TODO use context.
    this.socket = props.socket
    this.state = {
      messages: []
    }

    this.scrollToBottom = this.scrollToBottom.bind(this);
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

  scrollToBottom() {
    animateScroll(this.messages, 150);
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }
  
  render(props, state) {
    return (
      <div className={styles.messages} ref={ref => this.messages = ref}>
        {
          this.state.messages.map(msg => {
            if (msg.type === 'message') {
              return <p className={styles.message_self}>{msg.text}</p>
            } else {
              return <p className={styles.message_reply}>{msg.text}</p>
            }
          })
        }
      </div>
    );
  }
}
