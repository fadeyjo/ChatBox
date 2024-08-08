import s from './ProfileInfo.module.css';
import MyLink from '../UI/MyLink/MyLink';
import Button from '../UI/Button/Button';
import CreatePostModalWindow from '../CreatePostModalWindow/CreatePostModalWindow';
import { useState } from 'react';

export default function ProfileInfo({ customerToRender, id, setPosts }) {
	const [open, setOpen] = useState(false);

	const [years, birthday] = (() => {
		const todayDate = new Date();
		const todayYear = todayDate.getFullYear();
		const todayMonth = todayDate.getMonth() + 1;
		const todayDay = todayDate.getDate();
		const birthday = customerToRender.birthday.slice(0, 10);
		const [year, month, day] = birthday.split('-');
		if (todayMonth > month || (todayMonth === month && todayDay >= day)) {
			return [todayYear - year, birthday.split('-').reverse().join('.')];
		}
		return [todayYear - year - 1, birthday.split('-').reverse().join('.')];
	})();

	return (
		<div className={s.profile_container}>
			<div className={s.container}>
				<div className={s.img}></div>
				<div className={s.profile_info}>
					<div className={s.fio}>
						{[customerToRender.surname, customerToRender.name, customerToRender.patronymic].join(' ')}
					</div>
					<div className={s.age}>{`${years} years, ${birthday}`}</div>
					<div className={s.email}>{customerToRender.email}</div>
				</div>
			</div>
			<div className={s.button_container}>
				<MyLink>Friends</MyLink>
				{id ? null : <Button onClick={() => setOpen(true)}>Create post</Button>}
				<MyLink>Subscribers</MyLink>
			</div>
			<CreatePostModalWindow
				open={open}
				setOpen={setOpen}
				customerToRenderId={customerToRender.id}
				setPosts={setPosts}
			/>
		</div>
	);
}
