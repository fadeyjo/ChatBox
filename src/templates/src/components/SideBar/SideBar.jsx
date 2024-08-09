import s from "./SideBar.module.css";
import { Link } from "react-router-dom";

export default function SideBar() {
	return (
		<nav className={s.navigate}>
			<ul className={s.ul}>
				<li><Link className={s.link} to="/profile">Profile</Link></li>
				<li><Link className={s.link} to="/messages">Messages</Link></li>
				<li><Link className={s.link} to="/news">News</Link></li>
				<li><Link className={s.link} to="/friends">Friends</Link></li>
				<li><Link className={s.link} to="/subscribers">Subscribers</Link></li>
			</ul>
		</nav>
	);
}
