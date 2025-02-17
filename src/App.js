import React from 'react'
import { Switch, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from "./components/Login"
import Home from './components/Home'

const App = () => (
    <Switch>
        <ProtectedRoute exact path="/" component={Home}/>
        <Route exact path="/login" component={Login} />
    </Switch>
)
export default App
