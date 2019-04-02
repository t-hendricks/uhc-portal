import React from 'react';
import PropTypes from 'prop-types';

class LogWindow extends React.Component {
  componentDidMount() {
    const { getLogs, clusterID } = this.props;
    getLogs(clusterID);
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
  getLogs: PropTypes.func.isRequired,
  clusterID: PropTypes.string.isRequired,
  lines: PropTypes.string.isRequired,
};

export default LogWindow;
