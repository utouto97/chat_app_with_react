const api = require('axios').create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Accept': 'application/josn',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  },
  responseType: 'json'
});
api.defaults.withCredentials = true;

export default api;