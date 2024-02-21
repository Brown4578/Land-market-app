import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css';
import './index.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { CustomBrowserRouter } from './_helpers/history';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './_helpers/userContext';
// Put any other imports below so that CSS from your components takes precedence over default styles.

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <UserProvider>
      <CustomBrowserRouter>
        <App />
        <ToastContainer
          position='top-right'
          autoClose={1300}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
          transition={Flip}
        />
      </CustomBrowserRouter>{' '}
    </UserProvider>
  </Provider>
);
