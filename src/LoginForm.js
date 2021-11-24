import React, { useState } from 'react'
import { Box, Container, Grid, Tab, Tabs, TextField, Button, Alert, InputAdornment, IconButton, Tooltip, Typography, LinearProgress } from '@mui/material'
import { HelpOutline } from '@mui/icons-material'
import { Formik } from 'formik'
import { useHistory, Redirect, useLocation } from 'react-router-dom';
import {useAuth} from './useAuth';

const FormDisplay = (props) => {
  const { children, value, index} = props;

  return (
    <div hidden={value !== index}>
      {value === index && (
        <Grid item xs={12} sx={{ p: 3}}>
          <Container maxWidth="md">
            {children}
          </Container>
        </Grid>
      )}
    </div>
  )
}



const LoginForm = () => {
  const history = useHistory();
  const location = useLocation();
  const [login, error, signin, signout, register] = useAuth();
  
  let {from} = location.state || { from : { pathname: "/"}};

  const [value, setValue] = useState(0);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isBlurred, setIsBlurred] = useState(false);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  }

  const regexCheck = (pass) => {
    if(pass.length === 0){
      return 0;
    }
    let score = 0;
    let regexes = [
      /[a-z]{2,}/g,
      /[A-Z]{2,}/g,
      /[0-9]{1,}/g,
      /[.,?!;:]/g
    ];

    regexes.forEach(r => {
      if(pass.match(r) !== null && pass.match(r).length > 0){
        score++;
      }
    })

    return score;
  }

  const passwordCheck = (pass) => {
    let score = regexCheck(pass);
    if(pass.length >= 12) score++;
    if(pass.length !== 0){
      let isOverFourth = false;
      let passLen = pass.length;
      let passArr = pass.split("");
      for (let letter of passArr) {
        let count = 0;
        for (let i = 0; i < passLen; i++) {
          if (letter === passArr[i]) {
            count++;
          }
        }
        if (count > Math.ceil(passLen / 4)) {
          isOverFourth = true;
          break;
        }
      }
      if(!isOverFourth){
        score++;
      }
    }    
    setIsBlurred(true);
    setPasswordStrength(score);
  }
  
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Box sx={{
        minWidth: "25%",
        maxHeight: "60%",
        minHeight: "500px",
        boxShadow: 1,
        mt: "5rem"
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary" variant="fullWidth">
            <Tab label="Login"/>
            <Tab label="Sign Up"/>
          </Tabs>
        </Box>
        <FormDisplay value={value} index={0}>
          <Formik initialValues={{username: "", password: ""}}
          validate={values => {
            const errors = {};
            if(!values.username){
              errors.username = "Username is required";
            }
            if(!values.password){
              errors.password = "Password is required";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            signin(values.username, values.password, () => {
              setSubmitting(false);
            }, () => {
              history.replace(from);
            });
          }}>
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid item xs={12}>
                  <TextField
                  fullWidth
                  variant="standard"
                  name="username"
                  value={values.username}
                  label="Username"
                  onChange={handleChange}
                  /><br/>
                  {errors.username && touched.username ? (
                    <Alert severity="warning" color="error">{errors.username}</Alert>
                  ) : null}
                  <TextField
                  sx={{mt: 2}}
                  fullWidth
                  variant="standard"
                  name="password"
                  value={values.password}
                  label="Password"
                  onChange={handleChange}
                  type="password"
                  /><br/>
                  {errors.password && touched.password ? (
                    <Alert severity="warning" color="error">{errors.password}</Alert>
                  ) : null}
                  <Button 
                    sx={{mt: 3}}
                    fullWidth 
                    variant="contained" 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    Log in
                  </Button>
                  {error && <Alert severity="warning" color="error" sx={{ justifyContent: "center", mt: 1}}>{error}</Alert>}
                </Grid>
              </form>
            )}
            
          </Formik>
        </FormDisplay>
        <FormDisplay value={value} index={1}>
        <Formik initialValues={{username: "", password: "", repeatPassword: ""}}
          validate={values => {
            const errors = {};
            if(!values.username){
              errors.username = "Username is required";
            }
            if(!values.password){
              errors.password = "Password is required";
            } else if(passwordStrength < 4){
              errors.password = "Password strength has to be at least 60%"
            }
            if(!values.repeatPassword){
              errors.repeatPassword = "You need to repeat the password"
            } else if (values.password !== values.repeatPassword) {
              errors.repeatPassword = "Passwords need to match"
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            register(values.username, values.password, () => {
              setSubmitting(false);
          }, () => {
              history.replace(from);
          });
          }}>
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid item xs={12}>
                  <TextField
                  fullWidth
                  variant="standard"
                  name="username"
                  value={values.username}
                  label="Username"
                  onChange={handleChange}
                  onBlur={() => {
                    if(values.username !== ''){
                      try {
                        fetch(`http://localhost:3081/app/checkUsername/${values.username}`)
                        .then(response => response.json())
                        .then(data => setIsUsernameTaken(data.body));
                      } catch(err){
                        console.log(err);
                      }
                    }
                  }}
                  /><br/>
                  {errors.username && touched.username ? (
                    <Alert severity="warning" color="error">{errors.username}</Alert>
                  ) : null}
                  { values.username && isUsernameTaken ? (<Alert severity="warning" color="error">"That username is taken"</Alert>) : null}
                  <TextField
                  sx={{mt: 2}}
                  fullWidth
                  variant="standard"
                  name="password"
                  value={values.password}
                  label="Password"
                  onChange={handleChange}
                  onBlur={() => passwordCheck(values.password)}
                  onFocus={() => setIsBlurred(false)}
                  type="password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip placement="right" title="Password should contain at least 12 characters, 2 uppercase characters, 2 lowercase characters, 1 number, and 1 non-alphanumeric character">
                          <IconButton edge="end">
                            <HelpOutline color="gray"/>
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                  /><br/>
                  {errors.password && touched.password ? (
                    <Alert severity="warning" color="error">{errors.password}</Alert>
                  ) : null}
                  { isBlurred && <Box sx={{width: "100%"}}>
                    <Typography variant="subtitle1">Password Strength:</Typography>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                      <Box sx={{ width: "100%", mr: 1}}>
                        <LinearProgress variant="determinate" value={Math.round((passwordStrength * 100) / 6)} color={passwordStrength < 4 ? "warning" : "success"}/>
                      </Box>
                      <Box sx={{minWidth: 35}}>
                        <Typography variant="body1">{Math.round((passwordStrength * 100) / 6)}%</Typography>
                      </Box>
                    </Box>
                  </Box>}
                  <TextField
                  sx={{mt: 2}}
                  fullWidth
                  variant="standard"
                  name="repeatPassword"
                  value={values.repeatPassword}
                  label="Repeat Password"
                  onChange={handleChange}
                  type="password"
                  /><br/>
                  {errors.repeatPassword && touched.repeatPassword ? (
                    <Alert severity="warning" color="error">{errors.repeatPassword}</Alert>
                  ) : null}
                  <Button 
                    sx={{mt: 3}}
                    fullWidth 
                    variant="contained" 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </form>
            )}
            
          </Formik>
        </FormDisplay>
      </Box>
    </div> 
  )
}

export default LoginForm
