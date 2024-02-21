import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../../../_helpers/globalVariables';

export default function ProtectedRoute({ children }) {
  if (!localStorage.getItem('access_token')) {
    return <Navigate to={"/login"} replace />;
  } else {
    return children;
  }
}
