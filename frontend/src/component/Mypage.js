import React, { useState, useEffect } from 'react';

import API from '../API';

import { Container, CssBaseline, Avatar, Button, Typography, IconButton, TextField, Link } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
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
    backgroundColor: 'grey',
  },
}));

export default function Mypage(props) {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [username_status, setUsername_status] = useState('view');
  const [prev_username, setPrev_username] = useState('');
  const [err, setErr] = useState(false);

  useEffect(() => {
    API.get('/mypage')
      .then((response) => {
        setUsername(response.data.username);
        console.log(response);
      });
  }, []);

  const logout = e => {
    API.get('/logout');
    props.history.push('/login');
    e.preventDefault();
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountCircleIcon />
        </Avatar>
        {
          username_status === 'view' ? (
            <Typography component='h1' variant='h5'>
              {username}
              <IconButton
                size='small'
                onClick={e => {
                  e.preventDefault();
                  setPrev_username(username);
                  setUsername_status('edit');
                  setErr(true);
                }}>
                <EditIcon fontSize='small' />
              </IconButton>
            </Typography>
          ) : (username_status === 'edit' ? (
            <div>
              <TextField
                autoFocus
                required
                variant='outlined'
                error={err}
                onChange={e => {
                  const username = e.target.value;
                  setErr(username.length === 0 || username === prev_username);
                  setUsername(username);
                }}
                value={username}
              />
              <IconButton
                onClick={e => {
                  if (err) return;
                  e.preventDefault();
                  setUsername(prev_username);
                  setUsername_status('view');
                  setErr(false);
                }}>
                <CancelIcon />
              </IconButton>
              <Button
                variant='contained'
                color='primary'
                onClick={e => {
                  API.get('/check', {
                    params: {
                      username: username
                    }
                  }).then(res => {
                    if (res.data.count > 0) {
                      setErr(true);
                    } else {
                      setErr(false);
                      setUsername_status('send');
                    }
                    console.log(res);
                  });
                }}>
                check
              </Button>
            </div>
          ) : (
              <div>
                {username}
                <IconButton
                  onClick={e => {
                    e.preventDefault();
                    setUsername(prev_username);
                    setUsername_status('view');
                    setErr(false);
                  }}>
                  <CancelIcon />
                </IconButton>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={e => {
                    e.preventDefault();
                    setUsername_status('view');
                    setErr(false);
                    API.post('/change', ("username=" + username));
                  }}>
                  change
                 </Button>
              </div>
            ))
        }
        <Link href="/chat">Go to Chat Page</Link>
        <IconButton onClick={logout}>
          <ExitToAppIcon />
        </IconButton>
      </div >
    </Container >
  );
};
