import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Folder as FolderIcon, AddCircleOutline, ExpandLess, ExpandMore, Settings,
} from '@material-ui/icons';

import {
  List, ListItem, ListItemIcon, ListItemText, Collapse,
} from '@material-ui/core';

import Image from './Image';

import classes from './FolderExplorer.module.css';


class Folder extends Component {
  constructor(props) {
    super(props);

    const { id, filetree } = props;
    let folders = [];
    let images = [];

    if (filetree[id] !== undefined) {
      folders = filetree[id].folders;
      images = filetree[id].images;
    }

    this.state = {
      folders,
      images,

      isOpened: false,
    };
  }

  handleClick() {
    const { isOpened } = this.state;
    this.setState({ isOpened: !isOpened });
  }

  handleAddClick(event) {
    alert('add');
    event.stopPropagation();
  }

  handleEditClick(event) {
    alert('edit');
    event.stopPropagation();
  }

  render() {
    const { folders, images, isOpened } = this.state;

    const { name, filetree } = this.props;

    const isEmpty = !(folders.length || images.length);

    return (
      <div className={classes.nested}>
        <ListItem button={!isEmpty} onClick={() => this.handleClick()}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={name} />
          <Settings
            className={classes.icon}
            onClick={(event) => this.handleEditClick(event)}
          />
          <AddCircleOutline
            className={classes.icon}
            onClick={(event) => this.handleAddClick(event)}
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
                      key={current.key}
                      id={current.key}
                      filetree={filetree}
                    />
                  ))
                }
                {
                  images.map((current) => (
                    <Image
                      name={current.name}
                      key={current.key}
                      id={current.key}
                      mime={current.mime}
                    />
                  ))
                }
              </List>
            </Collapse>
          ) : <div />
        }
      </div>
    );
  }
}

export default Folder;

/*
Folder.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}; */
