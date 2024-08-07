import { Link } from "react-router-dom";
import s from "./MyLink.module.css";

export default function MyLink({children, linkTo}) {
    return (
        <Link
            to={linkTo}
            className={s.link}
        >
            {children}
        </Link>
    )
}