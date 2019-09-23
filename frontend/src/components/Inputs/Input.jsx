import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ChoiceInput from './ChoiceInput/ChoiceInput';
import HiddenInput from './HiddenInput/HiddenInput';
import ImageInput from './ImageInput/ImageInput';
import TextInput from './TextInput/TextInput';
import VideoInput from './VideoInput/VideoInput';

class Input extends Component {
  static defaultProps = {
    value: null,
    previewUrl: '',
    placeholder: '',
    choices: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let inputElement;
    const {
      type, name, value, rules, label, placeholder, previewUrl, choices, onStateChange,
    } = this.props;

    switch (type) {
      case ('text'): inputElement = (
        <TextInput
          name={name}
          value={value}
          label={label}
          placeholder={placeholder}
          rules={rules}
          onStateChange={onStateChange}
        />
      ); break;

      case ('textarea'): inputElement = (
        <TextInput
          name={name}
          value={value}
          label={label}
          placeholder={placeholder}
          rules={rules}
          multiline
          rows="6"
          onStateChange={onStateChange}
        />
      ); break;

      case ('email'): inputElement = (
        <TextInput
          type="email"
          name={name}
          value={value}
          label={label}
          placeholder={placeholder}
          rules={rules}
          onStateChange={onStateChange}
        />
      ); break;

      case ('image'): inputElement = (
        <ImageInput
          name={name}
          label={label}
          placeholder={placeholder}
          previewUrl={previewUrl}
          rules={rules}
          onStateChange={onStateChange}
        />
      ); break;

      case ('video'): inputElement = (
        <VideoInput
          name={name}
          label={label}
          placeholder={placeholder}
          rules={rules}
          onStateChange={onStateChange}
        />
      ); break;

      case ('hidden'): inputElement = (
        <HiddenInput
          name={name}
          value={value}
          onStateChange={onStateChange}
        />
      ); break;

      case ('choice'): inputElement = (
        <ChoiceInput
          name={name}
          value={value}
          choices={choices}
          label={label}
          placeholder={placeholder}
          rules={rules}
          onStateChange={onStateChange}
        />
      ); break;

      default: inputElement = <div />;
    }

    return <div>{inputElement}</div>;
  }
}

export default Input;

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
  rules: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  previewUrl: PropTypes.string,
  choices: PropTypes.array,
  onStateChange: PropTypes.func.isRequired,
};
