import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './lib/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authentication';

import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Entry from './components/Entry';

import 'bootstrap/dist/css/bootstrap.min.css';

if(localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);
    const decoded = jwt_decode(localStorage.jwtToken);
    store.dispatch(setCurrentUser(decoded));

    const currentTime = Date.now() / 1000;
    if(decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = '/login'
    }
}

const auth = store.getState().auth;

if (!auth.isAuthenticated && ['/login', '/register'].indexOf(window.location.pathname) < 0) {
    window.location.href = "/login";
}

class App extends Component {
    render() {
        return (
            <Provider store = { store }>
                <Router>
                    <div>
                        <Navbar />
                        <div className="container">
                            <Route exact path="/" component={ Home } />
                            <Route exact path="/add" render={()=><Entry type='Add'/>}/>
                            <Route exact path="/edit/:id" render={()=><Entry type='Edit'/>}/>
                            <Route exact path="/register" component={ Register } />
                            <Route exact path="/login" component={ Login } />
                        </div>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;