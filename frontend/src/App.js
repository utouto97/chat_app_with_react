import React from 'react';
import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Auth from './component/Auth';
import Login from './component/Login';
import Mypage from './component/Mypage';
import Chat from './component/Chat';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login} />
          <Auth redirectTo='/login'>
            <Switch>
              <Route path='/mypage' component={Mypage} />
              <Route path='/chat' component={Chat} />
            </Switch>
          </Auth>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
