import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Photo, Settings, Delete, SaveAlt, Close,
} from '@material-ui/icons';

import {
  Dialog, DialogContent, DialogTitle,
  ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';

import axios from 'axios';

import ServerForm from '../ServerForm/ServerForm';

import classes from './static/FolderExplorer.module.css';
import { BACKEND_URL } from '../../helpers/urls';

class Image extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      key: props.id,
      mime: props.mime,
      description: props.description,

      action: {},

      isOpenedDialog: false,
    };
  }

  onDialogClick() {
    const { isOpenedDialog } = this.state;
    this.setState({ isOpenedDialog: !isOpenedDialog });
  }

  onImageRemoveClick(event) {
    event.stopPropagation();
    this.removeImage();
  }

  onImageUpdateClick(event) {
    event.stopPropagation();

    const { key } = this.state;
    const { forms, parentKey } = this.props;

    this.setState({
      action: {
        title: 'Update Image Menu',
        type: 'image-update',
        action: `core/image/update/${key}/`,
        enctype: 'application/json',
        inputs: forms.image.update,
        hiddenInputs: [{ name: 'folder_key', value: parentKey }],
      },
    });
    this.onDialogClick();
  }

  onImageLoadClick(event) {
    event.stopPropagation();
  }

  onSubmitSuccess(data) {
    this.setState({ name: data.name, description: data.description });
    this.onDialogClick();
  }

  onImageClick(event) {
    event.preventDefault();
    const { onChangePreview } = this.props;
    const {
      name, description, key, mime,
    } = this.state;

    onChangePreview({
      name, description, key, mime,
    });
  }

  async removeImage() {
    try {
      const { key } = this.state;
      const { onRemoveImage } = this.props;
      await axios.post(`${BACKEND_URL}/core/image/delete/${key}/`);
      onRemoveImage(key);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const {
      name, key, mime, isOpenedDialog, action,
    } = this.state;

    const mediaType = mime.split('/')[1];
    const mediaUrl = `${BACKEND_URL}/core/image/download/${key}/`;
    const mediaName = `${name}.${mediaType}`;

    return (
      <div className={classes.nested}>
        <ListItem button onClick={(event) => this.onImageClick(event)}>
          <ListItemIcon>
            <Photo />
          </ListItemIcon>
          <ListItemText primary={name} />
          <a
            href={mediaUrl}
            download={mediaName}
            onClick={(event) => this.onImageLoadClick(event)}
            className={classes.link}
          >
            <SaveAlt className={classes.icon} />
          </a>
          <Settings
            className={classes.icon}
            onClick={(event) => this.onImageUpdateClick(event)}
          />
          <Delete
            className={classes.icon}
            onClick={(event) => this.onImageRemoveClick(event)}
          />
        </ListItem>
        <Dialog
          open={isOpenedDialog}
          maxWidth="md"
          fullWidth
          onClose={() => this.onDialogClick()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {action.title}
            <Close className={classes.close} onClick={() => this.onDialogClick()} />
          </DialogTitle>
          <DialogContent className={classes.content}>
            <ServerForm
              action={action.action}
              enctype={action.enctype}
              name={action.type}
              inputs={action.inputs}
              inputsHidden={action.hiddenInputs}
              onSubmitSuccess={(data) => this.onSubmitSuccess(data)}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Image;

Image.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  parentKey: PropTypes.string.isRequired,
  mime: PropTypes.string.isRequired,
  forms: PropTypes.object.isRequired,
  onChangePreview: PropTypes.func.isRequired,
  onRemoveImage: PropTypes.func.isRequired,
};
