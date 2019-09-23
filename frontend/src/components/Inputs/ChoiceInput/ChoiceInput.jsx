import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  FormControl, OutlinedInput, InputLabel, Select, MenuItem, withStyles,
} from '@material-ui/core';

import styles from './styles';


class ChoiceInput extends Component {
  static generateId() {
    return `_${Math.random().toString(36).substr(2, 9)}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      inputId: ChoiceInput.generateId(),
      name: props.name,
      value: props.value,
      isValid: true,
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
    this.setState({
      value: event.target.value,
    });
  }

  render() {
    const {
      inputId, name, value,
    } = this.state;

    const {
      label, choices, classes, rules,
    } = this.props;

    return (
      <div className={classes.root}>
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor={inputId}>
            <div className={classes.label}>
              {`${label}${rules.required ? ' *' : ''}`}
            </div>
          </InputLabel>
          <Select
            value={value}
            name={name}
            onChange={event => this.onChange(event)}
            input={
              (
                <OutlinedInput
                  id={inputId}
                  labelWidth={0}
                />
              )
            }
          >
            {
              choices.map(choice => (
                <MenuItem
                  key={ChoiceInput.generateId()}
                  value={choice.value}
                >
                  {choice.text}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(ChoiceInput);

ChoiceInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  choices: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  rules: PropTypes.object.isRequired,
  onStateChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
