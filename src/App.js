import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navigation from './Navigation';
import LoginForm from './LoginForm';
import Content from './Content';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ProvideAuth } from './useAuth';

const theme = createTheme({
  palette: {
    primary: {
      main: "#4bbc8e"
    },
    secondary: {
      main: "rgb(255, 255, 255)"
    }
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#2f4858"
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: "1.3rem",
          color: "white"
        },
        secondary: {
          fontSize: "1rem",
          color: "white"
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "white"
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            ":hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)"
            }
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#deb887",
          color: "rgb(255, 255, 255)"
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          background: "rgb(255, 255, 255)"
        }
      }
    }
  }
})

function App() {  
  return (
    <div className="App">
      <Router>
        <ProvideAuth>
          <ThemeProvider theme={theme}>
            <Navigation/>
            <Switch>
              <Route path="/login"><LoginForm /></Route>
              <Route path="/"><Content /></Route>
            </Switch>
          </ThemeProvider>
        </ProvideAuth>
      </Router>
    </div>
  );
}

export default App;
