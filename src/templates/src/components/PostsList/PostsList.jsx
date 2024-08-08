import s from "./PostsList.module.css";
import Post from "../Post/Post";

export default function PostsList({posts, customerToRender}) {
	return (
		<>
			{posts.length !== 0 ? (
				posts.map((post) => (
					<Post
						post={post}
						customerToRender={customerToRender}
                        key={post.id}
					/>
				))
			) : (
				<h1 className={s.no_posts}>Here no posts!</h1>
			)}
		</>
	);
}
