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

const MenuBar: React.FC = () => {
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

        <IconButton color="inherit" aria-label="menu" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            <MenuIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Home</MenuItem>
          <MenuItem onClick={handleClose}>Account</MenuItem>
          <MenuItem onClick={handleClose}>Resources</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
