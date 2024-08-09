import { Outlet } from 'react-router-dom';
import AuthHeader from '../AuthHeader/AuthHeader';
import SideBar from '../SideBar/SideBar';

export default function IsAuthDashBoard() {
	return (
		<>
			<AuthHeader />
			<SideBar />
			<Outlet />
		</>
	);
}
