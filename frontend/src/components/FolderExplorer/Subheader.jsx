import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  ListSubheader, Grid, Typography, TextField,
} from '@material-ui/core';

import classes from './static/Subheader.module.css';

class Subheader extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '' };
  }

  onEnter(event) {
    const { onSubmit } = this.props;
    const query = document.getElementById('outlined-name').value;
    onSubmit(query);
    event.preventDefault();
  }

  render() {
    return (
      <ListSubheader className={classes.subheader} component="div" id="nested-list-subheader">
        <Grid container>
          <Grid item xs={6}>
            <Typography className={classes.title} variant="h5">
              Folder Explorer
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <form onSubmit={(event) => this.onEnter(event)}>
              <TextField
                id="outlined-name"
                label="Search"
                variant="outlined"
              />
            </form>
          </Grid>
        </Grid>
      </ListSubheader>
    );
  }
}

export default Subheader;

Subheader.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
