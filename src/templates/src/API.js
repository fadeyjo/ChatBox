export default class API {
	static async createCustomer(customer) {
		return await fetch('http://localhost:8080/api/customer', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(customer),
		})
			.then((response) => response.json())
			.then((data) => data);
	}

	static async authCustomer({ email, password }) {
		return await fetch('http://localhost:8080/api/customer', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${email} ${password}`,
			},
		})
			.then((response) => response.json())
			.then((data) => data);
	}

	static async getUserById(id) {
		return await fetch(`http://localhost:8080/api/customer/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((data) => data);
	}

	static async getPostsByCustomerId(id) {
		return await fetch(`http://localhost:8080/api/post/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((data) => data);
	}

	static async createPost(customer_id, { publication_date, publication_time, content }) {
		return await fetch('http://localhost:8080/api/post', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				customer_id,
				publication_date,
				publication_time,
				content,
			}),
		})
			.then((response) => response.json())
			.then((data) => data);
	}

	static async subscribeOn(subscriberId, onWhoSubscribeId) {
		return await fetch('http://localhost:8080/api/subscriber', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				subscriberId,
				onWhoSubscribeId,
			}),
		})
			.then((response) => response.json())
			.then((data) => data);
	}

	static async isFriendsOrCustomerSubscribe(customerId, secondId) {
		return fetch(`http://localhost:8080/api/subscriber/${customerId}/${secondId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((data) => data.friendsOrCustomerSubscribe);
	}

	static async deleteFromFriend(customerId, deletableFriendId) {
		return fetch('http://localhost:8080/api/subscriber', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				customerId,
				deletableFriendId,
			}),
		})
			.then((response) => response.json())
			.then((data) => data.friendsOrCustomerSubscribe);
	}
}
