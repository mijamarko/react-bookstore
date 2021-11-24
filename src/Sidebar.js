import { Add, AllInclusive, Android, Apple, AutoAwesome, Computer, ExpandLess, ExpandMore, LibraryBooks, People, Search } from '@mui/icons-material'
import { Collapse, Divider, Drawer, IconButton, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, TextField, Toolbar } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const Sidebar = ({open, setOpen, selectedListItem, setSelectedListItem, setPage, getBooks}) => {
  
  const handleListClick = () => {
    setOpen(!open);
  }

  const selectListItem = (e, index) => {
    setPage(1);
    setSelectedListItem(index);
  }

  const searchForBooks = (e) => {
    if(e.target.key === "Enter" && e.target.value !== ""){
      if(selectedListItem === "All"){

      }
    }
    
  }

  return (
    <Drawer variant="permanent" sx={{ zIndex: -1, flexShrink: 0}}>
                <Box sx={{ width: "100%", minWidth: "280px"}}>
                  <Toolbar/>
                  <TextField variant="standard" color="secondary" label="Search" sx={{ mt: 2, width: "90%"}} 
                  focused 
                  InputProps={{ className: "search-input",
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton edge="start">
                        <Search color="secondary"/>
                      </IconButton>
                    </InputAdornment>
                  )}}
                  onKeyPress={(e) => {}}/>
                  <List sx={{ pl: 1}}>
                      <ListItemButton selected={selectedListItem === "All"}
                      onClick={(e) => selectListItem(e, "All")}>
                        <ListItemIcon>
                          <LibraryBooks />
                        </ListItemIcon>
                        <ListItemText primary="All Books"/>
                      </ListItemButton>
                      <ListItemButton onClick={() => handleListClick()}>
                        <ListItemIcon>
                          <AllInclusive />
                        </ListItemIcon>
                        <ListItemText primary="Genres"/>
                        {open ? <ExpandLess sx={{ color: "white"}}/> : <ExpandMore sx={{ color: "white"}}/>}
                      </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List sx={{ pl: 3}}>
                          <ListItemButton selected={selectedListItem === "Science Fiction"}
                      onClick={(e) => selectListItem(e, "Science Fiction")}>
                            <ListItemIcon>
                              <Android/>
                            </ListItemIcon>
                            <ListItemText secondary="Science Fiction"/>
                          </ListItemButton>
                          <ListItemButton selected={selectedListItem === "Fantasy"}
                      onClick={(e) => selectListItem(e, "Fantasy")}>
                            <ListItemIcon>
                              <AutoAwesome/>
                            </ListItemIcon>
                            <ListItemText secondary="Fantasy"/>
                          </ListItemButton>
                          <ListItemButton selected={selectedListItem === "Computing"}
                      onClick={(e) => selectListItem(e, "Computing")}>
                            <ListItemIcon>
                              <Computer/>
                            </ListItemIcon>
                            <ListItemText secondary="Computing"/>
                          </ListItemButton>
                          <ListItemButton selected={selectedListItem === "Mystery"}
                      onClick={(e) => selectListItem(e, "Mystery")}>
                            <ListItemIcon>
                              <Search/>
                            </ListItemIcon>
                            <ListItemText secondary="Mystery"/>
                          </ListItemButton>
                          <ListItemButton selected={selectedListItem === "Horror"}
                      onClick={(e) => selectListItem(e, "Horror")}>
                            <ListItemIcon>
                              <Apple/>
                            </ListItemIcon>
                            <ListItemText secondary="Horror"/>
                          </ListItemButton>
                      </List>
                    </Collapse>
                      <ListItemButton selected={selectedListItem === "Authors"}
                      onClick={(e) => selectListItem(e, "Authors")}>
                        <ListItemIcon>
                          <People />
                        </ListItemIcon>
                        <ListItemText primary="Authors"/>
                      </ListItemButton>
                      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)", width: "90%", ml: 1, mt: 1}}/>
                      <ListItemButton>
                        <ListItemIcon>
                          <Add/>
                        </ListItemIcon>
                        <ListItemText primary="Add New Book"/>
                      </ListItemButton>
                  </List>
                </Box>
              </Drawer>
  )
}

export default Sidebar
