import React, { useState } from 'react';

import API from '../API';

import { Container, CssBaseline, Avatar, Typography, Button, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  send: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login(props) {
  const classes = useStyles();

  const [user, setUser] = useState({
    username: '',
    password: ''
  });
  const [err, setErr] = useState({
    username: false,
    password: false,
  });

  const handleChangeUsername = e => {
    const username = e.target.value;
    setErr({
      username: (username.length === 0),
      password: err.password,
    });
    setUser({
      username: username,
      password: user.password
    });
  };

  const handleChangePassword = e => {
    const password = e.target.value;
    setErr({
      username: err.username,
      password: (password.length < 8),
    });
    setUser({
      username: user.username,
      password: password
    });
  };

  const send = e => {
    const body = Object.keys(user).map((key) =>
      key + "=" + encodeURIComponent(user[key])).join("&");

    API.post('/login', body)
      .then(res => props.history.push('/mypage'))
      .catch(e => console.log('login error: ', e));

    setUser({
      username: user.username,
      password: ''
    });
    e.preventDefault();
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form className={classes.form}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            autoFocus
            error={err.username}
            label='Username'
            value={user.username}
            onChange={handleChangeUsername}
          />
          <TextField
            type='password'
            variant='outlined'
            margin='normal'
            required
            fullWidth
            autoFocus
            error={err.password}
            label='Password'
            value={user.password}
            onChange={handleChangePassword}
          />
          <Button
            className={classes.send}
            fullWidth
            onClick={send}
            variant='contained'
            color='primary'>
            ログイン
          </Button>
        </form>
      </div >
    </Container>
  );
};

