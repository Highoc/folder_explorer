import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Photo, Settings, Delete, SaveAlt } from '@material-ui/icons';

import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import classes from './FolderExplorer.module.css';


class Image extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      key: props.id,
      mime: props.mime,
    };
  }

  handleRemoveClick(event) {
    alert('remove');
    event.stopPropagation();
  }

  handleEditClick(event) {
    alert('edit');
    event.stopPropagation();
  }

  handlePreviewClick(event) {
    alert('preview');
    event.preventDefault();
  }

  handleLoadClick(event) {
    event.stopPropagation();
  }

  render() {
    const { name, key, mime } = this.state;

    const mediaType = mime.split('/')[1];
    const mediaUrl = `http://localhost:8000/uploads/images/${key}.${mediaType}`;
    const mediaName = `${name}.${mediaType}`;

    return (
      <div className={classes.nested}>
        <ListItem button onClick={(event) => this.handlePreviewClick(event)}>
          <ListItemIcon>
            <Photo />
          </ListItemIcon>
          <ListItemText primary={name} />
          <a
            href={mediaUrl}
            download={mediaName}
            onClick={(event) => this.handleLoadClick(event)}
            className={classes.link}
          >
            <SaveAlt className={classes.icon} />
          </a>
          <Settings
            className={classes.icon}
            onClick={(event) => this.handleEditClick(event)}
          />
          <Delete
            className={classes.icon}
            onClick={(event) => this.handleRemoveClick(event)}
          />
        </ListItem>
      </div>
    );
  }
}

export default Image;
