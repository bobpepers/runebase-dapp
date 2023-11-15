import axios from 'axios';

axios.defaults.xsrfHeaderName = 'X-CSRF-Token';
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';

export default axios;
