import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HiddenInput extends Component {
  static defaultProps = {
    value: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      value: props.value,
    };
  }

  componentDidMount() {
    const { onStateChange } = this.props;
    onStateChange(this.state);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { value } = nextProps;
    this.setState({ value });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { value } = this.state;
    const { onStateChange } = this.props;
    if (prevState.value !== value) {
      onStateChange(this.state);
    }
  }

  render() {
    return <div />;
  }
}

export default HiddenInput;

HiddenInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,

  onStateChange: PropTypes.func.isRequired,
};
