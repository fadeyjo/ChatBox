import ProfileInfo from '../../ProfileInfo/ProfileInfo';
import { Link, useParams } from 'react-router-dom';
import API from '../../../API';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../context';
import PostsList from '../../PostsList/PostsList';

export default function ProfilePage() {
	const { id } = useParams();
	const { customer, setCustomer } = useContext(AuthContext);
	const [customerToRender, setCustomerToRender] = useState({ ...customer });
	const [posts, setPosts] = useState([]);

	function sortFunction(a, b) {
		const aYear = +a.publication_date.split('').slice(0, 4).join('');
		const bYear = +b.publication_date.split('').slice(0, 4).join('');
		if (aYear !== bYear) {
			return bYear - aYear;
		}
		const aMonth = +a.publication_date.split('').slice(5, 7).join('');
		const bMonth = +b.publication_date.split('').slice(5, 7).join('');
		if (aMonth !== bMonth) {
			return bMonth - aMonth;
		}
		const aDay = +a.publication_date.split('').slice(8, 10).join('');
		const bDay = +b.publication_date.split('').slice(8, 10).join('');
		if (aDay !== bDay) {
			return bDay - aDay;
		}
		const aHours = +a.publication_time.split('').slice(0, 2).join('');
		const bHours = +b.publication_time.split('').slice(0, 2).join('');
		if (aHours !== bHours) {
			return bHours - aHours;
		}
		const aMinutes = +a.publication_time.split('').slice(3, 5).join('');
		const bMinutes = +b.publication_time.split('').slice(3, 5).join('');
		return bMinutes - aMinutes;
	}

	useEffect(() => {
		(async () => {
			if (id) {
				setCustomerToRender(await API.getUserById(id));
				setPosts((await API.getPostsByCustomerId(id)).sort((a, b) => sortFunction(a, b)));
			} else {
				setPosts((await API.getPostsByCustomerId(customer.id)).sort((a, b) => sortFunction(a, b)));
			}
		})();
	}, [id]);
	return (
		<>
			<ProfileInfo
				customerToRender={customerToRender}
				id={id}
				setPosts={setPosts}
			/>
			<PostsList
				posts={posts}
				customerToRender={customerToRender}
			/>
			<Link to="/profile/14">1</Link>
		</>
	);
}
