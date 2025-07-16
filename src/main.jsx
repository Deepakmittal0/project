import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css'; // or ./main.css depending on your file name
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
