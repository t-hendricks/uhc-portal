/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, ExpandableSection } from '@patternfly/react-core';
import { ExpandIcon } from '@patternfly/react-icons';
import cx from 'classnames';
import screenfull from 'screenfull';
import { metricsStatusMessages } from '../../../../common/ResourceUsage/ResourceUsage.consts';
import clusterStates from '../../../../common/clusterStates';

const AUTOSCROLL_THRESHOLD = 20;

class LogWindow extends React.Component {
  constructor(props) {
    super(props);
    this.logPaneRef = React.createRef();
    this.cardRef = React.createRef(); // for fullscreen
  }

  state = {
    userScrolled: false,
    isFullScreen: false,
    isExpanded: false,
  }

  componentDidMount() {
    if (this.isShown()) {
      this.update();
      this.updateTimer = window.setInterval(this.update, 2000);
    }
    if (screenfull.isEnabled) {
      screenfull.on('change', this.onFullscreenChange);
    }
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.isPageVisible = document.visibilityState === 'visible';
  }

  shouldComponentUpdate(nextProps, nextState) {
    // avoid rendering on every prop/state change by manually comparing the ones we care about.
    // effectively this avoids rendering when a completed request has no new lines.
    return (
      nextState.userScrolled !== this.state.userScrolled
      || nextState.isExpanded !== this.state.isExpanded
      || nextState.isFullScreen !== this.state.isFullScreen
      || nextProps.lines !== this.props.lines
      || nextProps.cluster.state !== this.props.cluster.state
      || nextProps.cluster.id !== this.props.cluster.id
      || nextProps.errorCode !== this.props.errorCode
      || nextProps.logType !== this.props.logType
      || nextProps.isExpandable !== this.props.isExpandable
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { lines, errorCode, cluster } = this.props;
    const { isExpanded } = this.state;
    if (!prevProps.lines && lines) {
      // If this is the first time we're getting the log, it'll trigger a scroll event,
      // setting userScrolled since the view won't be scrolled all the way down.
      // So we need to account for that, and set it to false here.
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ userScrolled: false });
    }
    if ((prevProps.errorCode !== 403 && errorCode === 403)
        || cluster.state === clusterStates.ERROR) {
      if (this.updateTimer !== null) {
        window.clearInterval(this.updateTimer);
      }
    }
    if (isExpanded !== prevState.isExpanded) {
      // make sure to start or stop the timer when expanding / collapsing
      if (isExpanded) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ userScrolled: false });
      }
      this.onVisibilityChange();
    }
  }

  componentWillUnmount() {
    const { clearLogs } = this.props;
    if (this.updateTimer !== null) {
      window.clearInterval(this.updateTimer);
    }
    if (screenfull.isEnabled) {
      screenfull.off('change', this.onFullscreenChange);
    }
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    clearLogs();
    if (screenfull.isFullscreen) {
      screenfull.exit();
    }
  }

  /**
   * Is the view expanded (or non-expandable)?
   */
  isShown = () => {
    const { isExpanded } = this.state;
    const { isExpandable } = this.props;
    return (!isExpandable || isExpanded);
  }

  toggleExpanded = (isExpanded) => {
    this.setState({ isExpanded });
  }

  scrollToEnd = () => {
    const { lines } = this.props;
    if (lines) {
      const pane = this.logPaneRef.current;
      if (pane && pane.scrollTo) {
        pane.scrollTo({ top: pane.scrollHeight });
      }
    }
  }

  onScroll = (event) => {
    const { userScrolled } = this.state;
    const view = event.target;
    const currentScrollDiff = (view.scrollHeight - view.clientHeight) - view.scrollTop;
    if (!userScrolled
        && currentScrollDiff > AUTOSCROLL_THRESHOLD
        && this.isPageVisible
        && this.isShown()) {
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
    const isFullScreen = screenfull.isFullscreen;
    this.setState({ isFullScreen });
    if (!userScrolled) {
      this.scrollToEnd();
    }
  }

  onVisibilityChange = () => {
    if (this.updateTimer !== null) {
      window.clearInterval(this.updateTimer);
    }
    this.isPageVisible = document.visibilityState === 'visible';
    if (this.isShown()) {
      if (this.isPageVisible) {
        // update very 2s when page is visible
        this.updateTimer = window.setInterval(this.update, 2000);
        // issue another update call just to make sure we show fresh logs
        //  when the page becomes visible
        this.update();
      } else {
        // update every 15s if page is not visible, for better performance
        this.updateTimer = window.setInterval(this.update, 15000);
      }
    }
  }

  update = () => {
    const {
      getLogs, cluster, lines, len, logType, pending, errorCode,
    } = this.props;
    if (!pending && errorCode !== 403) {
      const requestLogType = cluster.state !== clusterStates.UNINSTALLING ? 'install' : 'uninstall';
      let offset = lines ? len : 0;
      if (logType !== requestLogType) { offset = 0; }

      getLogs(cluster.id, offset, requestLogType);
    }
  }

  fullScreen = () => {
    const { userScrolled } = this.state;
    if (!screenfull.isFullscreen) {
      const card = this.cardRef.current;
      screenfull.request(card).then(() => {
        if (!userScrolled) {
          // scroll to end if userScrolled was false *before* the fullscreen transition
          // with timeout to allow slower browsers to complete the fullscreen transition.
          setTimeout(() => {
            this.scrollToEnd();
          }, 100);
        }
        this.setState({ isFullScreen: true });
      });
    } else {
      screenfull.exit().then(() => {
        this.setState({ isFullScreen: false });
      });
    }
  }

  render() {
    const {
      lines, len, errorCode, cluster, isExpandable, className,
    } = this.props;
    const { userScrolled, isFullScreen, isExpanded } = this.state;
    const totalLines = lines ? len - 1 : 0;
    if (!userScrolled && !!totalLines && this.isShown()) {
      // requestAnimationFrame so this happens *after* render
      requestAnimationFrame(this.scrollToEnd);
    }

    let message;
    if (cluster.state === clusterStates.UNINSTALLING) {
      message = errorCode === 403
        ? metricsStatusMessages.uninstalling
        : 'Cluster uninstallation has started. Uninstallation log will appear here once it becomes available.';
    } else {
      message = errorCode === 403
        ? metricsStatusMessages.installing
        : 'Cluster installation has started. Installation log will appear here once it becomes available.';
    }

    const view = (
      <div
        className={
          cx('log-window-container', !!totalLines && 'log-window-container--with-lines', className)
        }
        ref={this.cardRef}
      >
        { !!totalLines && screenfull.isEnabled && (
        <div className="logview-buttons">
          <Button
            onClick={this.fullScreen}
            variant="link"
            icon={<ExpandIcon />}
          >
            { isFullScreen ? 'Exit full screen' : 'Full screen' }
          </Button>
        </div>
        )}
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
                  {lines || ''}
                </div>
              </div>
            </div>
          </div>
        ) : (
          cluster.state !== clusterStates.ERROR && (
            <p>
              {message}
            </p>
          )
        )}
      </div>
    );
    return isExpandable
      ? (
        <ExpandableSection
          id="toggle-logs"
          toggleTextCollapsed="View logs"
          toggleTextExpanded="Hide logs"
          onToggle={this.toggleExpanded}
          isExpanded={isExpanded}
          isActive={!isFullScreen}
        >
          {view}
        </ExpandableSection>
      ) : view;
  }
}

LogWindow.propTypes = {
  isExpandable: PropTypes.bool,
  clearLogs: PropTypes.func.isRequired,
  getLogs: PropTypes.func.isRequired,
  pending: PropTypes.bool,
  lines: PropTypes.string,
  len: PropTypes.number,
  logType: PropTypes.oneOf(['install', 'uninstall']),
  cluster: PropTypes.shape({
    id: PropTypes.string,
    state: PropTypes.string,
  }),
  errorCode: PropTypes.number,
  className: PropTypes.string,
};

export default LogWindow;
