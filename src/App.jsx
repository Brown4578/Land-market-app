import { useState, useEffect, useContext } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './common/layout/components/Layout';
import Loading from './navigation/Loader';
import Login from './views/auth/components/Login/Login';
import ProtectedRoute from './views/auth/components/ProtectedRoutes';
import { routes } from './routes';
import PageNotFound from './common/layout/components/PageNotFound';
import AccessDenied from './common/layout/components/AccessDenied';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useUserContext } from './_helpers/userContext';
import { companyDetailsService, userService } from './_services';
import { validatePermissionWithUserPermissions } from './_helpers/globalVariables';

function App(props) {
  const [loading, setLoading] = useState(true);
  const { user, updateUserContext, updateCompanyName } = useUserContext();

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      handleFetchMyUserInfo();
      fetchCompanyName();
    } else {
      setLoading(false);
    }
  }, []);

  const handleFetchMyUserInfo = (params) => {
    setLoading(true);
    userService
      .fetchMe(params)
      .then((resp) => {
        const body = resp.data.body;
        endLoading(false);
        updateUserContext(body);
      })
      .catch((err) => {
        endLoading(false);
      });
  };
  const fetchCompanyName = (params) => {
    companyDetailsService
      .fetchCompanyDetails(params)
      .then((response) => {
        const respData = response?.data?.companyName || '';
        updateCompanyName(respData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const endLoading = (params) => {
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }
  let loggedIn = false;
  return (
    <Routes>
      <Route path={'login'} element={<Login />} />
      <Route
        path={'/'}
        element={
          <ProtectedRoute>
            {user && user.permissions.length === 0 ? (
              <AccessDenied />
            ) : (
              <Layout />
            )}
          </ProtectedRoute>
        }
      >
        <Route path={'*'} element={<PageNotFound />} />
        {user &&
          routes.map((route, index) => {
            return (
              route.element &&
              validatePermissionWithUserPermissions(
                route.permission,
                user?.permissions
              ) && (
                <Route
                  key={index}
                  exact={route.exact}
                  path={route.key}
                  name={route.name}
                  element={route.element}
                />
              )
            );
          })}
      </Route>
    </Routes>
  );
}

export default App;
