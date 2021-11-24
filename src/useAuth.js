import React, {useState, useContext, createContext} from 'react';
import { useHistory } from 'react-router-dom';

const authContext = createContext();

export const ProvideAuth = ({children}) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>
        {children}
    </authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext);
}

const useProvideAuth = () => {
    let history = useHistory();
    const [login, setLogin] = useState(null);
    const [error, setError] = useState("");
    const signin = (username, password, failCallback = () => {}, okCallback = () => {}) => {
        fetch("http://localhost:3081/app/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password})
        }).then(response => response.json())
        .then(data => {
            if(data.status !== "ok"){
                setLogin(null);
                setError(data.body);
                failCallback();    
            }else{
                setLogin(data.body);
                setError(""); 
                okCallback();
            }
        })
        .catch(err => {
            setLogin(null);
            setError(err);
            failCallback();
        });
    }
    const signout = (cb = () => {}) => {
        setLogin(null);
        setError("");
        // cb();
    }

    const register = (username, password, failCallback = () => {}, okCallback = () => {}) => {
      fetch("http://localhost:3081/app/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password})
        }).then(response => response.json())
        .then(data => {
            if(data.status !== "ok"){
                setLogin(null);
                setError(data.body);
                failCallback();    
            }else{
                signin(data.body.username, data.body.password, () => {}, () => {
                  history.push("/");
                });
                setError("");
                // okCallback();
            }
        })
        .catch(err => {
            setLogin(null);
            setError(err);
            failCallback();
        });
    }

    return [login, error, signin, signout, register];
}