'use client'

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { Icon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Import an icon from @mui/icons-material
import Favicon from 'react-favicon';
import logo from './logo.png';

const TopBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Button color="inherit" aria-label="SFIC" onClick={handleClose}>
          <img src={logo.src} alt="SFIC Logo" style={{ height: '40px', marginRight: '10px', marginBottom: '10px'}} /> 
        <Typography variant="h6" style={{ flexGrow: 1 }}>
            SFIC
        </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
