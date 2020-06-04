import React from 'react';
import PropTypes from 'prop-types';
import {
  CardBody, CardHeader, Title, Button,
} from '@patternfly/react-core';
import { ExpandIcon } from '@patternfly/react-icons';
import { metricsStatusMessages } from '../../../../common/ResourceUsage/ResourceUsage.consts';

const AUTOSCROLL_THRESHOLD = 15;

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
    const { lines, errorCode } = this.props;
    if (!prevProps.lines && lines) {
      // If this is the first time we're getting the log, it'll trigger a scroll event,
      // setting userScrolled since the view won't be scrolled all the way down.
      // So we need to account for that, and set it to false here.
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ userScrolled: false });
    }
    if (prevProps.errorCode !== 403 && errorCode === 403) {
      if (this.updateTimer !== null) {
        window.clearInterval(this.updateTimer);
      }
    }
  }

  componentWillUnmount() {
    const { clearLogs } = this.props;
    if (this.updateTimer !== null) {
      window.clearInterval(this.updateTimer);
    }
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
    const currentScrollDiff = (view.scrollHeight - view.clientHeight) - view.scrollTop;
    if (!userScrolled && currentScrollDiff > AUTOSCROLL_THRESHOLD) {
      // user scrolled to anywhere which isn't the very bottom, stop auto-scrolling
      this.setState({ userScrolled: true });
    }
    if (userScrolled && currentScrollDiff <= AUTOSCROLL_THRESHOLD) {
      // user scrolled to the bottom (approximately), start auto-scrolling again
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
      getLogs, clusterID, lines, pending, errorCode,
    } = this.props;
    if (!pending && errorCode !== 403) {
      const offset = lines ? lines.split('\n').length : 0;
      getLogs(clusterID, offset);
    }
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
    const { lines, errorCode } = this.props;
    const { userScrolled, isFullScreen } = this.state;
    const totalLines = lines ? lines.split('\n').length - 1 : 0;
    if (!userScrolled && !!totalLines) {
      // requestAnimationFrame so this happens *after* render
      requestAnimationFrame(this.scrollToEnd);
    }

    const message = errorCode === 403
      ? metricsStatusMessages.installing
      : 'Cluster installation has started, installation log will appear here once it becomes available.';

    /* using <article className="pf-c-card"> instead of <Card>
    to make it possible to add a ref for the card, so we can use requestFullScreen */
    return (
      <article className="pf-c-card" ref={this.cardRef}>
        <CardHeader>
          <Title headingLevel="h2" size="lg" className="card-title logview-title">Installation Logs</Title>
          { !!totalLines && (
            <div className="logview-buttons">
              <Button
                onClick={this.fullScreen}
                variant="link"
                icon={<ExpandIcon />}
                isDisabled={!totalLines || !document.fullscreenEnabled}
              >
                { isFullScreen ? 'Exit Fullscreen' : 'Expand' }
              </Button>
            </div>
          )}
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
              {message}
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
  errorCode: PropTypes.number,
};

export default LogWindow;
