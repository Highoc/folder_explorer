import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';
import styles from './styles';

class VideoInput extends Component {
  static defaultProps = {
    placeholder: 'Выберите видеофайл',
    value: null,
  };

  static generateId() {
    return `_${Math.random().toString(36).substr(2, 9)}`;
  }

  static checkValidity(value, rules) {
    const result = {
      isValid: false,
      error: '',
    };

    if (!value) {
      if (rules.required) {
        result.error = 'Это обязательное поле';
      } else {
        result.isValid = true;
      }
      return result;
    }

    if (rules.mimetypes) {
      const mimetype = rules.mimetypes.find(elem => elem === value.type);
      if (!mimetype) {
        result.error = 'Некорректный формат видео (допустимый формат - mp4)';
        return result;
      }
    }

    if (rules.max_size) {
      if (value.size > rules.max_size) {
        result.error = 'Видеофайл слишком велик';
        return result;
      }
    }

    result.isValid = true;
    return result;
  }

  constructor(props) {
    super(props);
    const validation = VideoInput.checkValidity(props.value, props.rules);
    this.state = {
      inputId: VideoInput.generateId(),

      name: props.name,
      value: props.value,

      placeholder: props.placeholder,

      isValid: validation.isValid,
      error: validation.error,

      isTouched: false,
    };
  }

  componentDidMount() {
    const { onStateChange } = this.props;
    onStateChange(this.state);
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
    const file = event.target.files[0];
    const filename = file.name;

    const { isValid, error } = VideoInput.checkValidity(file, rules);
    this.setState({
      value: file, isValid, error, isTouched: true, placeholder: filename,
    });

    event.preventDefault();
  }

  render() {
    const {
      label, rules, classes,
    } = this.props;

    const {
      inputId, placeholder, isValid, isTouched, error,
    } = this.state;

    const isCorrect = !isTouched || isValid;

    return (
      <div className={classes.root}>
        <fieldset error={`${!isCorrect}`} className={classes.body}>
          <legend error={`${!isCorrect}`} className={classes.legend}>
            {`${label}${rules.required ? ' *' : ''}`}
          </legend>
          <label htmlFor={inputId} className={classes.uploadArea}>
            <div className={classes.button}>Выбрать</div>
            <div className={classes.placeholder}>{placeholder}</div>
            <input
              id={inputId}
              type="file"
              className={classes.input}
              accept="video/*"
              onChange={event => this.onChange(event)}
            />
          </label>
        </fieldset>
        <div error={`${!isCorrect}`} className={classes.error}>{error}</div>
      </div>
    );
  }
}


export default withStyles(styles)(VideoInput);

VideoInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  rules: PropTypes.object.isRequired,
  onStateChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
