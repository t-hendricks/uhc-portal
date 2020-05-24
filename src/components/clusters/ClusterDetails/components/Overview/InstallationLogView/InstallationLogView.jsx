import React from 'react';
import PropTypes from 'prop-types';
import {
  CardBody, CardHeader, Title, Button,
} from '@patternfly/react-core';
import { DownloadIcon, ExpandIcon } from '@patternfly/react-icons';

class LogWindow extends React.Component {
  updateTimer = null;

  constructor(props) {
    super(props);
    this.logPaneRef = React.createRef();
    this.cardRef = React.createRef(); // for fullscreen
  }

  state = {
    userScrolled: false,
    isFullScreen: false,
  }

  componentDidMount() {
    this.update();
    this.updateTimer = window.setInterval(this.update, 2000);
    document.addEventListener('fullscreenchange', this.onFullscreenChange);
  }

  componentDidUpdate(prevProps) {
    const { lines } = this.props;
    if (!prevProps.lines && lines) {
      // If this is the first time we're getting the log, it'll trigger a scroll event,
      // setting userScrolled since the view won't be scrolled all the way down.
      // So we need to account for that, and set it to false here.
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ userScrolled: false });
    }
  }

  componentWillUnmount() {
    const { clearLogs } = this.props;
    window.clearInterval(this.updateTimer);
    document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    clearLogs();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  scrollToEnd = () => {
    const { lines } = this.props;
    if (lines) {
      const pane = this.logPaneRef.current;
      pane.scrollTo({ top: pane.scrollHeight });
    }
  }

  onScroll = (event) => {
    const { userScrolled } = this.state;
    const view = event.target;
    if (!userScrolled && view.scrollTop !== (view.scrollHeight - view.clientHeight)) {
      // user scrolled to anywhere which isn't the very bottom, stop auto-scrolling
      this.setState({ userScrolled: true });
    }
    if (userScrolled && view.scrollTop === (view.scrollHeight - view.clientHeight)) {
      // user scrolled to the bottom, start auto-scrolling again
      this.setState({ userScrolled: false });
    }
  }

  onFullscreenChange = () => {
    const { userScrolled } = this.state;
    const isFullScreen = !!document.fullscreenElement;
    this.setState({ isFullScreen });
    if (!userScrolled) {
      this.scrollToEnd();
    }
  }

  update = () => {
    const {
      getLogs, clusterID, lines, pending,
    } = this.props;
    if (!pending) {
      const offset = lines ? lines.split('\n').length : 0;
      getLogs(clusterID, offset);
    }
  }

  download = () => {
    const { lines } = this.props;
    const blob = new Blob([lines], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    window.location.assign(url);
  }

  fullScreen = () => {
    const { userScrolled } = this.state;
    if (!document.fullscreenElement) {
      const card = this.cardRef.current;
      card.requestFullscreen().then(() => {
        if (!userScrolled) {
          // scroll to end if userScrolled was false *before* the fullscreen transition
          // with timeout to allow slower browsers to complete the fullscreen transition.
          setTimeout(() => {
            this.scrollToEnd();
          }, 100);
        }
      });
    } else {
      document.exitFullscreen().then(() => {
        this.setState({ isFullScreen: false });
      });
    }
  }

  render() {
    const { lines } = this.props;
    const { userScrolled, isFullScreen } = this.state;
    const totalLines = lines ? lines.split('\n').length - 1 : 0;
    if (!userScrolled && !!totalLines) {
      // requestAnimationFrame so this happens *after* render
      requestAnimationFrame(this.scrollToEnd);
    }
    /* using <article className="pf-c-card"> instead of <Card>
    to make it possible to add a ref for the card, so we can use requestFullScreen */
    return (
      <article className="pf-c-card" ref={this.cardRef}>
        <CardHeader>
          <Title headingLevel="h2" size="lg" className="card-title logview-title">Installation Logs</Title>
          <div className="logview-buttons">
            <Button onClick={this.download} variant="link" icon={<DownloadIcon />} isDisabled={!totalLines}>Download</Button>
            <Button
              onClick={this.fullScreen}
              variant="link"
              icon={<ExpandIcon />}
              isDisabled={!totalLines || !document.fullscreenEnabled}
            >
              { isFullScreen ? 'Exit Fullscreen' : 'Expand' }
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          { totalLines ? (
            <div className="log-window">
              <div className="log-window__header">
                {totalLines}
                {' '}
              lines
              </div>
              <div className="log-window__body">
                <div className="log-window__scroll-pane" ref={this.logPaneRef} onScroll={this.onScroll}>
                  <div className="log-window__contents">
                    <div className="log-window__contents__text">
                      {lines || ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>
              Cluster installation has started,
              installation log will appear here once it becomes available.
            </p>
          )}
        </CardBody>
      </article>
    );
  }
}

LogWindow.propTypes = {
  clearLogs: PropTypes.func.isRequired,
  getLogs: PropTypes.func.isRequired,
  pending: PropTypes.bool,
  lines: PropTypes.string,
  clusterID: PropTypes.string,
};

export default LogWindow;
