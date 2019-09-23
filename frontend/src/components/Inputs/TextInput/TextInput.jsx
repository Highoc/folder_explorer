import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

class TextInput extends Component {
  static defaultProps = {
    type: 'text',
    value: '',
    placeholder: '',
    multiline: false,
    rows: '1',
  };

  static checkValidity(value, rules) {
    const result = {
      isValid: false,
      error: '',
    };

    if (!value || value.trim() === '') {
      if (rules.required) {
        result.error = 'Это обязательное поле';
      } else {
        result.isValid = true;
      }
      return result;
    }

    if (rules.min_length) {
      if (value.length < rules.min_length) {
        result.error = `Минимальная длина поля - ${rules.min_length} символов`;
        return result;
      }
    }

    if (rules.max_length) {
      if (value.length > rules.max_length) {
        result.error = `Максимальная длина поля - ${rules.max_length} символов`;
        return result;
      }
    }

    result.isValid = true;
    return result;
  }

  constructor(props) {
    super(props);
    const validation = TextInput.checkValidity(props.value, props.rules);
    this.state = {
      name: props.name,
      value: props.value,

      isValid: validation.isValid,
      error: validation.error,

      isTouched: false,
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

  onChange(event) {
    const { rules } = this.props;
    const { value } = event.target;
    const { isValid, error } = TextInput.checkValidity(value, rules);
    this.setState({
      value, isValid, error, isTouched: true,
    });
  }

  render() {
    const {
      name, value, error, isValid, isTouched,
    } = this.state;

    const {
      type, rules, label, placeholder, multiline, rows,
    } = this.props;

    const isCorrect = !isTouched || isValid;

    return (
      <TextField
        type={type}

        name={name}
        value={value}

        label={label}
        placeholder={placeholder}
        helperText={error}
        error={!isCorrect}
        required={rules.required}

        onChange={event => this.onChange(event)}

        multiline={multiline}
        rows={rows}

        fullWidth
        margin="normal"
        variant="outlined"
      />
    );
  }
}

export default TextInput;

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,

  rules: PropTypes.object.isRequired,

  onStateChange: PropTypes.func.isRequired,

  type: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.string,
};
