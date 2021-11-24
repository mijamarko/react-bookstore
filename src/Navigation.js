import { AppBar, IconButton, Toolbar, Typography, Menu, MenuItem, Grow } from '@mui/material'
import { AutoStories, AccountCircle } from '@mui/icons-material'
import React, { useState } from 'react'
import { useAuth } from './useAuth';

const Navigation = () => {
  const [login, error, signin, signout, register] = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  }
  return (
      <AppBar position="static" sx={{ backgroundColor: "#4bbc8e", color: "white"}}>
        <Toolbar>
          <IconButton size="large" edge="start">
            <AutoStories sx={{ color: 'white'}}/>
          </IconButton>
          <Typography sx={{ textTransform: "none", fontSize: "1.3rem", fontWeight: 700, cursor: "pointer"}}>
            Ćazim's Book Emporium
          </Typography>
          {login && <> <Typography variant="h6" sx={{ marginLeft: "auto" }}>
            Hello, {login.username}
          </Typography>
          <IconButton size="large" edge="end" onClick={handleClick}>
            <AccountCircle sx={{ color: 'white'}}/>
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} TransitionComponent={Grow}>
            <MenuItem>Add New Book</MenuItem>
            <MenuItem onClick={(e) => {
              handleClose();
              signout();
              }}>Sign Out</MenuItem>
          </Menu>
          </>}
        </Toolbar>
      </AppBar>
  )
}

export default Navigation
