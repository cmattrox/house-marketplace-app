import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

const PrivateRoute = () => {
	const { loggedIn, checkingStatus } = useAuthStatus();

	if (checkingStatus) {
		setTimeout(() => {
			return <Spinner />;
		}, 2000);
	}

	return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
