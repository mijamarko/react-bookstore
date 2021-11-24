import { Grid, Box, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Redirect, Route} from 'react-router-dom'
import { useAuth } from './useAuth';
import './App.css'; 
import Sidebar from './Sidebar';
import Cards from './Cards';

const Content = () => {
  const [login] = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedListItem, setSelectedListItem] = useState("All");
  const [list, setList] = useState([]);
  const [length, setLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const getBooks = (page = 1, selectedListItem) => {
    let start = (page * 20) - 19;
    let end = start + 19;
    if(login){
      let param = 'app/books';
      switch(selectedListItem){
        case "Horror":
        case "Science Fiction":
        case "Computing":
        case "Mystery":
        case "Fantasy":
          param = `app/books/search/${selectedListItem}`;
          break;
        default:
          break;
      }
      fetch(`http://localhost:3081/${param}/${start}/${end}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${login.jwt}`
      }
    })
    .then(console.log(`http://localhost:3081/${param}/${start}/${end}`))
    .then(response => response.json())
    .then(data => {
      if(data.status === "ok"){
        setLength(data.body.length);
        setList(data.body.results);
        setLoading(false);
        setError(null);
      } else {
        setLength(0);
        setList([]);
        setLoading(false);
        setError(data.body);
      }
    })
    .catch(err => {
      setLength(0);
      setList([]);
      setLoading(false);
      setError(err);
    })
    }
  }


  useEffect(() => {
    getBooks(page, selectedListItem);
  }, [page, selectedListItem]);



  return (
    <Route render={({location}) => {
      if(login){
        return (
          <Grid container sx={{ display: "flex" }} spacing={0}>
            <Box sx={{ border: "1px solid blue", position: "fixed", zIndex: -1}}>
              <Sidebar open={open} setOpen={setOpen}
              selectedListItem={selectedListItem} setSelectedListItem={setSelectedListItem} setPage={setPage} getBooks={getBooks}/>
            </Box>
            <Grid container sx={{ p: 1, position: "fixed", left: "280px", height: "100%"}}>
              {loading ? 
              <Grid item sx={{ display: "flex", width: "calc(100% - 280px)", height: "calc(100% - 64px)", alignItems: "center", justifyContent: "center"}}>
                <CircularProgress size="8rem"/>
              </Grid>:
              <Grid item sx={{ display: "flex", width: "calc(100% - 280px)", height: "calc(100% - 64px)"}}>
                <Cards list={list} setList={setList} length={length} page={page} setPage={setPage}/>
              </Grid>
                }
            </Grid>
          </Grid>
        );
      }else{
        return <Redirect to={{pathname: "/login", state: {from: location}}}/>
      }}}/>
  )
  
}

export default Content
