'use client'

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Icon, SvgIcon} from '@mui/material';
//import CustomIcon from '../src/app/favicon.ico'; // Replace with the path to your SVG file


const TopMenuBar: React.FC = () => {
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
            <Icon color="inherit" aria-label="Icon">
             CustomIcon
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            SFIC
          </Typography>
          </Icon>
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
