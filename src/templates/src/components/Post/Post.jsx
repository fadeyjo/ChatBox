import s from "./Post.module.css";

export default function Post({post, customerToRender}) {
	return (
		<div className={s.post}>
			<div className={s.post_info}>
				<div className={s.img}></div>
				<div className={s.fio_yeaes}>
					<div className={s.fio}>{[customerToRender.surname, customerToRender.name].join(" ")}</div>
					<div className={s.date}>{`${post.publication_date.split("").splice(0, 10).join("").split("-").reverse().join(".")}, ${post.publication_time.split("").splice(0, 5).join("")}`}</div>
				</div>
			</div>
			<div className={s.content}>
				{post.content}
			</div>
		</div>
	);
}
