import React, { Component } from 'react';

import {
  List, Paper, Grid,
} from '@material-ui/core';

import axios from 'axios';

import Folder from './Folder';
import Preview from './Preview';
import Subheader from './Subheader';

import classes from './static/FolderExplorer.module.css';
import { BACKEND_URL } from '../../helpers/urls';

class FolderExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filetree: {},

      forms: {
        folder: { create: [], update: [] },
        image: { create: [], update: [] },
      },

      isLoaded: false,
      currentPreview: undefined,
    };
  }

  async componentDidMount() {
    try {
      const filetree = await axios.get(`${BACKEND_URL}/core/search/`);
      this.setState({ filetree: filetree.data, isLoaded: true });

      const patch = '00000000000000000000000000000000';
      const folderCreateForm = await axios.get(`${BACKEND_URL}/core/folder/create/`);
      const folderUpdateForm = await axios.get(`${BACKEND_URL}/core/folder/update/${patch}/`);
      const imageCreateForm = await axios.get(`${BACKEND_URL}/core/image/create/`);
      const imageUpdateForm = await axios.get(`${BACKEND_URL}/core/image/update/${patch}/`);

      this.setState({
        forms: {
          folder: {
            create: folderCreateForm.data,
            update: folderUpdateForm.data,
          },
          image: {
            create: imageCreateForm.data,
            update: imageUpdateForm.data,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  onChangePreview(image) {
    this.setState({ currentPreview: image });
  }

  async reloadTree(query) {
    try {
      const filetree = await axios.get(`${BACKEND_URL}/core/search/?search=${query}`);
      if (Object.keys(filetree.data).length === 0) {
        filetree.data = null;
      }
      this.setState({ filetree: filetree.data, isLoaded: true });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const {
      filetree, isLoaded, forms, currentPreview,
    } = this.state;

    if (!isLoaded) {
      return <div>Not downloaded yet</div>;
    }

    let list = <div />;
    if (filetree !== null) {
      filetree.root.folders.sort((a, b) => (b.name < a.name) - (a.name < b.name));
      list = (
        <div>
          {
          filetree.root.folders.map((current) => (
            <Folder
              name={current.name}
              id={current.key}
              key={current.key}
              parentKey={current.parent_folder_key}
              filetree={filetree}
              forms={forms}
              onChangePreview={(value) => this.onChangePreview(value)}
            />
          ))
        }
        </div>
      );
    }

    return (
      <Grid className={classes.root} container>
        <Grid item xs={5}>
          <Paper className={classes.paper} square>
            <List
              component="nav"
              subheader={<Subheader onSubmit={(query) => this.reloadTree(query)} />}
            >
              {list}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Preview image={currentPreview} />
        </Grid>
      </Grid>
    );
  }
}

export default FolderExplorer;
