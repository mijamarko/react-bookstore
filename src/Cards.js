import { Check, CheckCircle, Delete, Edit, Error, Info } from '@mui/icons-material'
import { Button, Card, CardActionArea, CardActions, CardContent, Dialog, FormControlLabel, Grid, IconButton, Pagination, Rating, Switch, TextField, Tooltip, Typography } from '@mui/material'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { useAuth } from './useAuth'

{/* <Card sx={{ width: "300px", height: "180px", textAlign: "left", mr: 1.5, ml: 1.5}}>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5" gutterBottom>Ovo je naslov knjige</Typography>
            <Typography variant="h6">Ovo je ime autora</Typography>
            <Typography varuabt="body1">Ovo je datum izdavanja</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ display: "flex", justifyContent: "space-between"}}>
          <Rating readOnly value={3.5} precision={0.5}/>
          <IconButton>
            <MoreVert/>
          </IconButton>
        </CardActions>
      </Card> */}

const Cards = ({ list, setList, length, page, setPage }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [mode, setMode] = useState("preview");

  const [login] = useAuth();

  const handleClickOpen = (e, id, mode) => {
    let obj = list.filter(el => el.id === id);
    setMode(mode);
    setData(obj);
    setOpen(true);    
  }

  const deleteBook = (e, id) => {
    fetch(`http://localhost:3081/app/books/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${login.jwt}`
      }
    })
    .then(response => response.json())
    .then(data => {
      data.status === "ok" ? console.log("Deleted") : console.log("Error: ", data.body);
    })
    .then(() => {
      setList(list.filter(el => el.id !== id));
    })
  }

  const editBook = (id, values) => {
    fetch(`http://localhost:3081/app/books/${id}`, {
      method: 'PUT',
      headers: {
        'ContentType': "application/json",
        'Authorization': `Bearer ${login.jwt}`
      },
      body: JSON.stringify(values)
    })
    .then(response => response.json())
    .then(data => {
      data.status === "ok" ? console.log("Edited!") : console.log("Error: ", data.body);
    })
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleChange = (e, v) => {
    setPage(v);
  }

  return (
    <div style={{
      width: "100%"
    }}>
      <div style={{
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "flex-start",
        height: "calc(100% - 5px - 35px)",
        overflow: "auto"
      }}>
        {list.map(el => {
          return (
            <Card key={el.id.toString()} sx={{ width: "290px", height: "180px", textAlign: "left", m: 1.5}}>
              <CardActionArea>
                <CardContent>
                  <Tooltip title={el.title}><Typography variant="h5" gutterBottom noWrap>{el.title}</Typography></Tooltip>
                  <Tooltip title={el.authors.join(", ")}><Typography variant="h6" noWrap>{el.authors.length > 1 ? el.authors[0] + ", " + el.authors[1] : el.authors[0]}</Typography></Tooltip>
                  <Typography variant="body1">{el.publishDate}</Typography>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ display: "flex", justifyContent: "space-between"}}>
                <Rating readOnly value={el.rating} precision={0.2}/>
                <span>
                  <IconButton onClick={(e) => handleClickOpen(e, el.id, "preview")}>
                    <Info/>
                  </IconButton>
                  <IconButton onClick={(e) => handleClickOpen(e, el.id, "edit")}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={(e) => deleteBook(e, el.id)}>
                    <Delete />
                  </IconButton>
                </span>
              </CardActions>
            </Card>
          )
        })}
        <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        sx={{height: "100%"}}
        >
          {data &&
           (mode === "preview" ?
            <Grid container sx={{ p: 4}}>
            <Grid item xs={12}>
              <Typography variant="h2">{data[0].title}</Typography>
            </Grid>
            <Grid item xs={12}>
              <label>Authors:</label>
              <Typography variant="h5" gutterBottom>{data[0].authors.join(", ")}</Typography>
            </Grid>
            <Grid item xs={2} sx={{textAlign: "center"}}>
              <label>Genre:</label>
              <Typography>{data[0].genre}</Typography>
            </Grid>
            <Grid item xs={2} sx={{textAlign: "center"}}>
              <label>Publish date:</label>
              <Typography>{data[0].publishDate}</Typography>
            </Grid>
            <Grid item xs={2} sx={{textAlign: "center"}}>
              <label>ISBN:</label>
              <Typography>{data[0].isbn}</Typography>
            </Grid>
            <Grid item xs={2} sx={{textAlign: "center"}}>
              <label>No. of pages:</label>
              <Typography>{data[0].pages}</Typography>
            </Grid>
            <Grid item xs={2} sx={{textAlign: "center"}}>
              <label>Rating:</label><br/>
              <Rating readOnly value={data[0].rating} precision={0.2}/>
            </Grid>
            <Grid item xs={2} sx={{textAlign: "center"}}>
              <label>Availability:</label><br/>
              {data[0].available.toString() == "true" ? <CheckCircle color="success"/> : <Error color="error"/>}
            </Grid>
          </Grid>:
          <Grid container sx={{ p: 4, display: "flex", justifyContent: "center"}}>
            <Formik initialValues={{
              authors: data[0].authors,
              publishDate: data[0].publishDate,
              rating: data[0].rating,
              genre: data[0].genre,
              title: data[0].title,
              isbn: data[0].isbn,
              available: data[0].available,
              pages: data[0].pages
            }}
            onSubmit={(values, { setSubmitting }) => {
              editBook(data[0].id, values);
              setSubmitting(false);
            }}>
              {({
                values,
                touched,
                handleChange,
                handleSubmit,
                isSubmitting}) => (
                  <form style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "55%"
                  }} onSubmit={handleSubmit}>
                    <Grid item xs={12}>
                      <TextField
                      sx={{ mt: 2}}
                      fullWidth
                      variant="standard"
                      name="title"
                      value={values.title}
                      label="Title"
                      onChange={handleChange}
                      /><br/>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                      sx={{ mt: 2}}
                      fullWidth
                      variant="standard"
                      name="authors"
                      value={values.authors.join(", ")}
                      label="Authors"
                      onChange={handleChange}
                      /><br/>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                      sx={{ mt: 2}}
                      fullWidth
                      variant="standard"
                      name="genre"
                      value={values.genre}
                      label="Genre"
                      onChange={handleChange}
                      /><br/>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                      sx={{ mt: 2}}
                      fullWidth
                      variant="standard"
                      name="pages"
                      value={values.pages}
                      label="No. of pages"
                      onChange={handleChange}
                      /><br/>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2}}>
                      <label>Rating:</label><br/>
                      <Rating
                      name="rating"
                      value={values.rating}
                      onChange={handleChange}
                      /><br/>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                      sx={{ mt: 2}}
                      fullWidth
                      variant="standard"
                      name="publishDate"
                      value={values.publishDate}
                      label="Publish Date"
                      onChange={handleChange}
                      /><br/>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                      sx={{ mt: 2}}
                      fullWidth
                      variant="standard"
                      name="isbn"
                      value={values.isbn}
                      label="ISBN"
                      onChange={handleChange}
                      /><br/>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                      label="Availability"
                      control={
                        <Switch
                          name="available"
                          checked={Boolean(values.available)}
                          onChange={handleChange}
                        />
                      }
                      /><br/>
                    </Grid>
                    <Grid item xs={12} sx={{textAlign: "center", mt: 2}}>
                      <Button variant="contained"
                      fullWidth
                      type="submit"
                      disabled={isSubmitting}
                      >Edit</Button>
                    </Grid>
                  </form>
              )}
            </Formik>
          </Grid>)
          }
        </Dialog>
      </div>
      <div style={{
        position: "fixed",
        bottom: "5px",
        width: "calc(100% - 280px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Pagination count={Math.round(length/20)} page={page} onChange={handleChange} size="large" showFirstButton showLastButton/>
      </div>
    </div>
  )
}

export default Cards
