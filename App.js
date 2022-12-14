import React from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import AllApps from './views/management/apps/all';
import EditApp from './views/management/apps/edit';
import AppForm from './views/management/apps/components/AppForm';

function App() {

  return (
    <BrowserRouter basename="/dashboardpc">
      <Switch>
        <PrivateRoute exact path="/management/createApp">
          <AppForm />
        </PrivateRoute>
        <PrivateRoute exact path="/management/apps">
          <AllApps />
        </PrivateRoute>
        <Route path="/management/apps/:id" exact component={EditApp} />
      </Switch>
    </BrowserRouter>
  );
}
const user = JSON.parse(localStorage.getItem('user'));

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default App;
