import React from 'react';
import '../App.css';
import { Route, Redirect } from 'react-router-dom';
import API from '../API';

class Auth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isAuthenticated: false
    };
  }

  async componentDidMount() {
    await API.get('/auth')
      .then(res => {
        console.log(res.data.status);
        this.setState({ isAuthenticated: res.data.status });
      });
    console.log('componentDidMount: ', this.state);
    this.setState({ loading: false });
  }

  render() {
    console.log('render:', this.state);
    const { loading, isAuthenticated } = this.state;

    if (loading) {
      return (<div></div>);
    }

    return (
      isAuthenticated ? <Route children={this.props.children} />
        : <Redirect to={this.props.redirectTo} />
    )
  }
}

export default Auth;