import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import clone from 'clone';

import { Button, withStyles } from '@material-ui/core';

import Input from '../Inputs/Input';

import styles from './styles';

const json = { 'Content-Type': 'application/json' };
const multipart = { 'Content-Type': 'multipart/form-data' };

class ServerForm extends Component {
  static defaultProps = {
    onSubmitSuccess: () => {},
    onSubmitFailed: () => {},
    inputsHidden: [],
    getInputsDynamic: () => ([]),
  };

  static checkValidity(inputs) {
    let isValid = true;
    for (const key in inputs) {
      isValid = isValid && inputs[key].isValid;
    }
    return isValid;
  }

  constructor(props) {
    super(props);
    this.state = {
      name: props.name,

      inputs: clone(props.inputs),
      inputsHidden: clone(props.inputsHidden),

      isReady: true,
      isValid: false,

      errors: {},
    };

    this.backend = (headers) => axios.create({
      baseURL: 'http://192.168.43.230:8000',
      timeout: 50000,
      headers,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ inputsHidden: clone(nextProps.inputsHidden) });
  }

  async onSubmit() {
    const {
      action, enctype, onSubmitSuccess, onSubmitFailed,
    } = this.props;

    const { name } = this.state;

    let type;
    switch (enctype) {
      case ENCTYPE.JSON: type = json; break;
      case ENCTYPE.MULTIPART: type = multipart; break;
      default: console.log(`ServerForm[${name}] Enctype property is incorrect`); return;
    }

    try {
      const formData = this.getFormData();
      const response = await this.backend(type).post(action, formData);
      this.reloadForm();
      onSubmitSuccess(response.data);
    } catch (error) {
      console.log(`ServerForm[${name}] ${error}`);
      this.setState({ errors: JSON.parse(error.request.response) });
      onSubmitFailed(error);
    }
  }

  onInputStateChange(state) {
    const { inputs } = this.state;
    const input = inputs.find(elem => elem.name === state.name);
    input.value = state.value;
    input.isValid = state.isValid;
    const isValid = ServerForm.checkValidity(inputs);
    this.setState({ inputs, isValid });
  }

  getFormData() {
    const { inputs, inputsHidden, name } = this.state;
    const { enctype, getInputsDynamic } = this.props;

    const inputsDynamic = getInputsDynamic();
    const inputsAll = inputs.concat(inputsHidden).concat(inputsDynamic);

    let formData;
    switch (enctype) {
      case ENCTYPE.JSON:
        formData = {};
        for (const input of inputsAll) {
          if (input.value) {
            formData[input.name] = input.value;
          }
        }
        break;
      case ENCTYPE.MULTIPART:
        formData = new FormData();
        for (const input of inputsAll) {
          if (input.value) {
            if (input.name === 'main') {
              formData.append(input.name, JSON.stringify(input.value));
            } else {
              formData.append(input.name, input.value);
            }
          }
        }
        break;
      default:
        console.log(`ServerForm[${name}] Enctype property is incorrect`)
        formData = {};
    }

    return formData;
  }

  reloadForm() {
    const { inputs, inputsHidden } = this.props;
    this.setState({
      inputs: clone(inputs),
      inputsHidden: clone(inputsHidden),
      isReady: true,
      isValid: false,

      errors: {},
    });
  }

  render() {
    const {
      inputs, errors, isReady, isValid,
    } = this.state;

    const { classes } = this.props;

    let inputList = <div />;
    if (isReady) {
      inputList = inputs.map(input => (
        <Input
          key={input.name}
          {...input}
          onStateChange={data => this.onInputStateChange(data)}
        />
      ));
    }

    const errorList = Object.keys(errors).map(key => <h3>{`${key}: ${errors[key]}`}</h3>);

    return (
      <div>
        <div>
          {inputList}
        </div>
        <div className={classes.error}>
          {errorList}
        </div>
        <Button onClick={() => this.onSubmit()} color="primary" disabled={!isValid}>
          Отправить
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(ServerForm);

const ENCTYPE = {
  MULTIPART: 'multipart/form-data',
  JSON: 'application/json',
};

ServerForm.propTypes = {
  name: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  enctype: PropTypes.string.isRequired,
  inputs: PropTypes.arrayOf(PropTypes.object).isRequired,
  inputsHidden: PropTypes.arrayOf(PropTypes.object),
  onSubmitSuccess: PropTypes.func,
  onSubmitFailed: PropTypes.func,
  getInputsDynamic: PropTypes.func,
  classes: PropTypes.object.isRequired,
};
