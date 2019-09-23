import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Folder as FolderIcon, AddCircleOutline, Close,
  ExpandLess, ExpandMore, Settings, AddPhotoAlternate,
} from '@material-ui/icons';

import {
  List, ListItem, ListItemIcon, ListItemText, Collapse,
  Dialog, DialogContent, DialogTitle,
} from '@material-ui/core';

import ServerForm from '../ServerForm/ServerForm';
import Image from './Image';

import classes from './static/FolderExplorer.module.css';

class Folder extends Component {
  constructor(props) {
    super(props);

    const { id, filetree } = props;
    let folders = [];
    let images = [];

    if (filetree[id] !== undefined) {
      folders = filetree[id].folders;
      images = filetree[id].images;
      folders.sort((a, b) => (b.name < a.name) - (a.name < b.name));
      images.sort((a, b) => (b.name < a.name) - (a.name < b.name));
    }

    this.state = {
      folders,
      images,

      name: props.name,
      action: {},

      isOpened: false,
      isOpenedDialog: false,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { filetree } = this.props;
    if (nextProps.filetree !== filetree) {
      const { id, filetree: filetreeNew } = nextProps;
      let folders = [];
      let images = [];

      if (filetreeNew[id] !== undefined) {
        folders = filetreeNew[id].folders;
        images = filetreeNew[id].images;
        folders.sort((a, b) => (b.name < a.name) - (a.name < b.name));
        images.sort((a, b) => (b.name < a.name) - (a.name < b.name));
      }

      this.setState({ folders, images });
    }
  }

  onClick(event) {
    event.stopPropagation();
    const { isOpened } = this.state;
    this.setState({ isOpened: !isOpened });
  }

  onDialogClick() {
    const { isOpenedDialog } = this.state;
    this.setState({ isOpenedDialog: !isOpenedDialog });
  }

  onCreateFolderClick(event) {
    event.stopPropagation();

    const { id, forms } = this.props;
    this.setState({
      action: {
        title: 'Create Folder Menu',
        type: 'folder-create',
        action: 'core/folder/create/',
        enctype: 'application/json',
        inputs: forms.folder.create,
        hiddenInputs: [{ name: 'parent_folder_key', value: id }],
      },
    });

    this.onDialogClick();
  }

  onCreateImageClick(event) {
    event.stopPropagation();

    const { id, forms } = this.props;
    this.setState({
      action: {
        title: 'Create Image Menu',
        type: 'image-create',
        action: 'core/image/create/',
        enctype: 'multipart/form-data',
        inputs: forms.image.create,
        hiddenInputs: [{ name: 'folder_key', value: id }],
      },
    });

    this.onDialogClick();
  }

  onRemoveImage(key) {
    const { images: oldImages } = this.state;
    const images = oldImages.filter((current) => current.key !== key);
    this.setState({ images });
  }

  onUpdateFolderClick(event) {
    event.stopPropagation();

    const { id, parentKey, forms } = this.props;
    this.setState({
      action: {
        title: 'Update Folder Menu',
        type: 'folder-update',
        action: `core/folder/update/${id}/`,
        enctype: 'application/json',
        inputs: forms.folder.update,
        hiddenInputs: [{ name: 'parent_folder_key', value: parentKey }],
      },
    });

    this.onDialogClick();
  }

  onSubmitSuccess(data) {
    const { action, images, folders } = this.state;

    switch (action.type) {
      case 'folder-create':
        folders.push(data);
        folders.sort((a, b) => (b.name < a.name) - (a.name < b.name));
        this.setState({ folders });
        break;
      case 'folder-update':
        this.setState({ name: data.name });
        break;
      case 'image-create':
        images.push(data);
        images.sort((a, b) => (b.name < a.name) - (a.name < b.name));
        this.setState({ images });
        break;
      default:
        console.log('error');
    }

    this.onDialogClick();
  }

  render() {
    const {
      folders, images, isOpened, isOpenedDialog, action, name,
    } = this.state;

    const { filetree, onChangePreview, forms } = this.props;

    const isEmpty = !(folders.length || images.length);

    return (
      <div className={classes.nested}>
        <ListItem button={!isEmpty} onClick={(event) => this.onClick(event)}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={name} />
          <Settings
            className={classes.icon}
            onClick={(event) => this.onUpdateFolderClick(event)}
          />
          <AddCircleOutline
            className={classes.icon}
            onClick={(event) => this.onCreateFolderClick(event)}
          />
          <AddPhotoAlternate
            className={classes.icon}
            onClick={(event) => this.onCreateImageClick(event)}
          />
          { !isEmpty ? isOpened ? <ExpandLess /> : <ExpandMore /> : <ExpandMore opacity="0.3" /> }
        </ListItem>
        {
          !isEmpty ? (
            <Collapse in={isOpened} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {
                  folders.map((current) => (
                    <Folder
                      name={current.name}
                      id={current.key}
                      key={current.key}
                      parentKey={current.parent_folder_key}
                      filetree={filetree}
                      forms={forms}
                      onChangePreview={(value) => onChangePreview(value)}
                    />
                  ))
                }
                {
                  images.map((current) => (
                    <Image
                      name={current.name}
                      description={current.description}
                      id={current.key}
                      key={current.key}
                      parentKey={current.parent_folder_key}
                      mime={current.mime}
                      forms={forms}
                      onChangePreview={(value) => onChangePreview(value)}
                      onRemoveImage={(key) => this.onRemoveImage(key)}
                    />
                  ))
                }
              </List>
            </Collapse>
          ) : <div />
        }
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

export default Folder;

Folder.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  parentKey: PropTypes.string.isRequired,
  filetree: PropTypes.object.isRequired,
  forms: PropTypes.object.isRequired,
  onChangePreview: PropTypes.func.isRequired,
};
