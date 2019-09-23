import React, { Component } from 'react';

import {
  List, ListSubheader,
  Card, CardActionArea, CardActions, CardContent, CardMedia,
} from '@material-ui/core';

import TextField from '@material-ui/core/TextField';

import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import axios from 'axios';

import Folder from './Folder';
import Image from './Image';

import classes from './FolderExplorer.module.css';


class FolderExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = { filetree: {}, isLoaded: false };
  }

  async componentDidMount() {
    try {
      const filetree = await axios.get('http://localhost:8000/core/search/');
      this.setState({ filetree: filetree.data, isLoaded: true });
      console.log(filetree);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { filetree, isLoaded } = this.state;

    if (!isLoaded) {
      return <div>Not downloaded yet</div>;
    }

    return (
      <Grid className={classes.root} container>
        <Grid item xs={5}>
          <Paper className={classes.paper} square>
            <List
              component="nav"
              subheader={<Subheader />}
            >
              {
                filetree.root.folders.map((current) => (
                  <Folder
                    name={current.name}
                    key={current.key}
                    id={current.key}
                    filetree={filetree}
                  />
                ))
              }
              {
                filetree.root.images.map((current) => (
                  <Image
                    name={current.name}
                    key={current.key}
                    id={current.key}
                    mime={current.mime}
                  />
                ))
              }
            </List>
          </Paper>
        </Grid>
        <Grid item xs={7}>
          <Card className={classes.card} square>
            <CardActionArea>
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Lizard
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                  across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                Share
              </Button>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

class Subheader extends Component {
  constructor(props) {
    super(props);
    this.state = { search: {}, isLoaded: false };
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
            <form onSubmit={() => {alert('submit');}}>
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

export default FolderExplorer;
