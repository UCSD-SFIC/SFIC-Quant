'use client'

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const TopMenuBar: React.FC = () => {
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Your App Name
          </Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Option 1</Button>
          <Button color="inherit">Option 2</Button>
          <Button color="inherit">Settings</Button>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* This is used to add space below the fixed app bar */}
    </div>
  );
};

export default TopMenuBar;
