import React from 'react';
import PropTypes from 'prop-types';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

class LiveDateFormat extends React.Component {
  state = { now: new Date() };

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.timer = null;
  }

  componentDidMount() {
    this.update();
    this.timer = setInterval(this.update, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  update() {
    this.setState({ now: new Date().getTime() });
  }

  render() {
    const { now } = this.state;
    const { timestamp } = this.props;
    return <DateFormat type="relative" date={timestamp} now={now} />;
  }
}

LiveDateFormat.propTypes = {
  timestamp: PropTypes.number.isRequired,
};

export default LiveDateFormat;
