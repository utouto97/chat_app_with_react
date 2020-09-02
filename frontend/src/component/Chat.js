import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';

import { Container, CssBaseline, IconButton, TextField, Link } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    margin: theme.spacing(1),
    color: 'orange',
  }
}));

export default function Chat(props) {
  const classes = useStyles();

  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [err, setErr] = useState(false);
  const [socket,] = useState(socketio.connect('http://localhost:4001'));

  useEffect(() => {
    socket.on('chatMessage', obj => {
      setLogs(old => [obj, ...old]);
    });
  }, []);

  return (
    < Container component='main' maxWidth='xs' >
      {console.log(logs)}
      <CssBaseline />
      <div className={classes.paper}>
        <Link href="/mypage">Go to MyPage</Link>
        <div>
          <TextField
            autoFocus
            variant='outlined'
            value={message}
            error={err}
            onChange={e => {
              if (!e.target.value) setErr(false);
              setMessage(e.target.value);
            }}
            onKeyPress={e => {
              if (e.key == 'Enter') {
                if (!message) setErr(true);
                else {
                  socket.emit('chatMessage', message);
                  setMessage('');
                }
              }
            }}
          />
          <IconButton
            onClick={e => {
              if (!message) setErr(true);
              else {
                socket.emit('chatMessage', message);
                setMessage('');
              }
            }}>
            <SendIcon className={classes.icon} />
          </IconButton>
        </div>
        <div>
          {logs.map((item, index) => (
            <div key={index}>
              <div>{item.username} {item.date}</div>
              <div>{item.message}</div>
            </div>
          ))}
        </div>
      </div>
    </Container >
  );
}
