import ProfileInfo from '../../ProfileInfo/ProfileInfo';
import { Link, useParams } from 'react-router-dom';
import API from '../../../API';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../context';
import Post from '../../Post/Post';

export default function ProfilePage() {
	const { id } = useParams();
	const { customer, setCustomer } = useContext(AuthContext);
	const [customerToRender, setCustomerToRender] = useState({ ...customer });
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		(async () => {
			if (id) {
				setCustomerToRender(await API.getUserById(id));
				setPosts(await API.getPostsByCustomerId(id));
			} else {
				setPosts(await API.getPostsByCustomerId(customer.id));
			}
		})();
	}, [id]);
	return (
		<>
			<ProfileInfo customer={customerToRender} />
			{posts.map((post) => <Post post={post} customerToRender={customerToRender} />)}
			<Link to="/profile/1">1</Link>
		</>
	);
}
