import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import styles from './styles';


class ImageInput extends Component {
  static defaultProps = {
    placeholder: 'Выберите изображение',
    previewUrl: '',
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
        result.error = 'Некорректный формат изображения (допустимый формат - png)';
        return result;
      }
    }

    if (rules.max_size) {
      if (value.size > rules.max_size) {
        result.error = 'Изображение слишком велико';
        return result;
      }
    }

    result.isValid = true;
    return result;
  }

  constructor(props) {
    super(props);
    const validation = ImageInput.checkValidity(props.value, props.rules);
    this.state = {
      inputId: ImageInput.generateId(),

      name: props.name,
      value: props.value,

      placeholder: props.placeholder,
      previewUrl: props.previewUrl,

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

  onLoad(event) {
    const { previewUrl } = this.state;
    URL.revokeObjectURL(previewUrl);
    event.preventDefault();
  }

  onChange(event) {
    const { rules } = this.props;
    const file = event.target.files[0];
    const filename = file.name;
    const previewUrl = URL.createObjectURL(file);

    const { isValid, error } = ImageInput.checkValidity(file, rules);
    this.setState({
      value: file, isValid, error, previewUrl, isTouched: true, placeholder: filename,
    });

    event.preventDefault();
  }

  render() {
    const {
      label, rules, classes,
    } = this.props;

    const {
      inputId, previewUrl, placeholder, isValid, isTouched, error,
    } = this.state;

    const isCorrect = !isTouched || isValid;

    return (
      <div className={classes.root}>
        <fieldset error={`${!isCorrect}`} className={classes.body}>
          <legend error={`${!isCorrect}`} className={classes.legend}>
            {`${label}${rules.required ? ' *' : ''}`}
          </legend>
          <div className={classes.preview}>
            <img
              alt=""
              src={previewUrl}
              onLoad={event => this.onLoad(event)}
              className={classes.image}
            />
          </div>
          <label htmlFor={inputId} className={classes.uploadArea}>
            <div className={classes.button}>Выбрать</div>
            <div className={classes.placeholder}>{placeholder}</div>
            <input
              id={inputId}
              type="file"
              className={classes.input}
              accept="image/*"
              onChange={event => this.onChange(event)}
            />
          </label>
        </fieldset>
        <div error={`${!isCorrect}`} className={classes.error}>{error}</div>
      </div>
    );
  }
}

export default withStyles(styles)(ImageInput);

ImageInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  rules: PropTypes.object.isRequired,
  previewUrl: PropTypes.string,
  onStateChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
