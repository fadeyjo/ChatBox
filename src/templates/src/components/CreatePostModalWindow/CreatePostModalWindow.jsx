import s from './CreatePostModalWindow.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../UI/Button/Button';
import API from '../../API';

export default function CreatePostModalWindow({ open, setOpen, customerToRenderId, setPosts }) {
	const formik = useFormik({
		initialValues: {
			content: '',
		},
		onSubmit: async (value) => {
			const todayDate = new Date();
			const day = todayDate.getDate();
			const month = todayDate.getMonth() + 1;
			const year = todayDate.getFullYear();
			const minutes = todayDate.getMinutes();
			const hours = todayDate.getHours();
			const post = await API.createPost(customerToRenderId, {
				content: value.content,
				publication_date: [year, month < 10 ? '0' + month : month, day < 10 ? '0' + day : day].join('-'),
				publication_time: [hours < 10 ? '0' + hours : hours, minutes < 10 ? '0' + minutes : minutes].join(':'),
			});
			setPosts((prev) => [post, ...prev]);
			setOpen(false);
		},
		validationSchema: Yup.object().shape({
			content: Yup.string().max(255, 'Must be shorter').required('Required'),
		}),
	});
	return (
		<div
			onClick={() => setOpen(false)}
			className={open ? [s.modal, s.open].join(' ') : s.modal}
		>
			<div
				className={s.content}
				onClick={(e) => e.stopPropagation()}
			>
				<h1 className={s.title}>Create new post</h1>
				<form
					className={s.form}
					onSubmit={formik.handleSubmit}
				>
					<label className={s.text}>Enter your content here:</label>
					<textarea
						className={s.textarea}
						placeholder="your content..."
						name="content"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.content}
					></textarea>
					{formik.errors.content && formik.touched.content ? (
						<div className={s.error}>{formik.errors.content}</div>
					) : (
						<div className={s.error}></div>
					)}
					<Button type="submit">Create post</Button>
				</form>
				<Button
					onClick={() => {
						setOpen(false);
					}}
				>
					Close
				</Button>
			</div>
		</div>
	);
}
