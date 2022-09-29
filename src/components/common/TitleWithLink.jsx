import React from 'react';
import PropTypes from 'prop-types';
import { LinkIcon } from '@patternfly/react-icons';
import { Title, Split, SplitItem } from '@patternfly/react-core';
import { HashLink as Link } from 'react-router-hash-link';
import { withRouter } from 'react-router';
import './TitleWithLink.scss';

class TitleWithLink extends React.Component {
  constructor(props) {
    super(props);
    this.titleRef = React.createRef();
  }

  state = { shouldScroll: false };

  componentDidMount() {
    const { location, id } = this.props;
    if (location.hash === `#${id}`) {
      this.setState({ shouldScroll: true });
    }
  }

  scrollOnLoad = () => {
    const { shouldScroll } = this.state;
    if (this.titleRef && this.titleRef.current) {
      if (document.getElementById('root').scrollTop === 0) {
        // only scroll if the user hasn't managed to scroll manually before we got here
        this.titleRef.current.scrollIntoView();
      }
    }
    if (shouldScroll) {
      this.setState({ shouldScroll: false });
    }
  };

  render() {
    const { headingLevel, size, id, text, pathname } = this.props;
    const { shouldScroll } = this.state;
    if (shouldScroll) {
      // requestAnimationFrame so this happens *after* render
      requestAnimationFrame(this.scrollOnLoad);
    }

    return (
      <Split hasGutter className="title-with-link">
        <SplitItem>
          {/* ref on the span cause it can't be on a function component
          and the Link is visible only on hover */}
          <span ref={this.titleRef} />
          <Title id={id} headingLevel={headingLevel} size={size}>
            {text}
          </Title>
        </SplitItem>
        <SplitItem className="show-on-hover">
          <Link to={`${pathname}#${id}`} smooth>
            <LinkIcon />
          </Link>
        </SplitItem>
      </Split>
    );
  }
}

TitleWithLink.propTypes = {
  headingLevel: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  location: PropTypes.shape({
    hash: PropTypes.string,
  }),
};

export default withRouter(TitleWithLink);
