import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Card, CardContent, CardMedia, Typography,
} from '@material-ui/core';

import classes from './static/FolderExplorer.module.css';
import patch from './media/patch.png';
import { BACKEND_URL } from '../../helpers/urls';

class Preview extends Component {
  constructor(props) {
    super(props);
    const { image } = props;
    this.state = {
      name: image.name,
      description: image.description,
      url: patch,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { image } = this.props;
    if (nextProps.image !== image) {
      const {
        name, description, key, mime,
      } = nextProps.image;
      const type = mime.split('/')[1];
      const url = `${BACKEND_URL}/uploads/images/${key}.${type}`;
      this.setState({ name, description, url });
    }
  }

  render() {
    const { name, description, url } = this.state;
    return (
      <Card className={classes.card} square>
        <CardMedia
          component="img"
          className={classes.media}
          image={url}
        />
        <CardContent className={classes.content}>
          <Typography gutterBottom variant="h3" align="center" noWrap width="80%">
            {name}
          </Typography>
          <Typography className={classes.description} variant="body1" color="textSecondary" align="center" width="80%">
            {description}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default Preview;

Preview.propTypes = {
  image: PropTypes.objectOf({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    mime: PropTypes.string.isRequired,
  }),
};

Preview.defaultProps = {
  image: {
    name: 'This is Simple Folder Explorer',
    description: 'Here will be a description of the selected image',
    key: '',
    mime: 'image/png',
  },
};
