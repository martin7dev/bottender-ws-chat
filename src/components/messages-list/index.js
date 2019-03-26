import { h, Component } from "preact";
import Markdown from 'preact-markdown'
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

    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
  }

  componentDidMount() {
    this.socket.on('bot response', this.props.handleMessage)
    this.messages.scrollTop = this.messages.scrollHeight
  }

  componentWillUnmount() {
    this.socket.off('bot response', this.props.handleMessage)
  }


  scrollToBottom() {
    animateScroll(this.messages, 150);
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  handleButtonClick (button) {
    if (button.content_type === 'text') {
      this.socket.emit('chat message', { 
        msg: button.payload, 
        location: window.location.href
      });
    }
    if (button.content_type === 'json') {
      this.socket.emit('chat message', { 
        data: button.payload, 
        location: window.location.href
      });
    }
  }

  renderMessage(msg) {
    if (typeof msg.content === "undefined" || msg.content === null)
      return null
    switch(msg.type) {
      case 'message':
        return <span className={styles.message_self}>{msg.content}</span>
      case 'reply':
        return <span className={styles.message_reply}>{msg.content}</span>
      case 'buttons':
        return (
          <div className={styles.buttons}>
            {this.renderButtons(msg.content)}
          </div>
          )
      case 'markdown':
        return (
          <span className={styles.message_reply}>
            <Markdown
              markdown={msg.content}
              className={styles.message_reply} />
          </span>
        )
      case 'image':
        return <img src={msg.content} style={{ maxWidth: '50%' }} />
      case 'file':
        return (
          <a 
            href={msg.content.url} 
            target='_blank'
            className={styles.message_reply}>
            {msg.content.name}
          </a>
        )
      default:
        return null
    }
  }

  renderButtons(buttons) {
    return buttons.map(button => (
      <button 
        className={styles.button}
        onClick={() => this.handleButtonClick(button)}>
        {button.title}
      </button>
    ))
  }
  
  render(props, state) {
    return (
      <div 
        className={styles.messages} 
        ref={ref => this.messages = ref}>
        {
          props.messages.map(msg => 
            this.renderMessage(msg))
        }
      </div>
    );
  }
}
