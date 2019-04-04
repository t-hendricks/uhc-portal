import React from 'react';
import PropTypes from 'prop-types';

class LogWindow extends React.Component {
  componentWillUnmount() {
    const { clearLogs } = this.props;
    clearLogs();
  }

  render() {
    const { lines } = this.props;

    return (
      <div className="log-window">
        <div className="log-window__header">
          Last 100 lines
        </div>
        <div className="log-window__body">
          <div className="log-window__scroll-pane">
            <div className="log-window__contents">
              <div className="log-window__contents__text">
                {lines || ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LogWindow.propTypes = {
  clearLogs: PropTypes.func.isRequired,
  lines: PropTypes.string.isRequired,
};

export default LogWindow;
