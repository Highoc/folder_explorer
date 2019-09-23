import React from 'react';
import './App.css';

import Container from '@material-ui/core/Container';

import FolderExplorer from './components/FolderExplorer';

function App() {
  return (
    <Container maxWidth="lg">
      <FolderExplorer/>
    </Container>
  );
}

export default App;
