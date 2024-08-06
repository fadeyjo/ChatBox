import { Link } from "react-router-dom";
import s from "./HeaderLink.module.css";

export default function HeaderLink({children, linkTo}) {
    return (
        <Link to={linkTo} className={s.link}>
            {children}
        </Link>
    )
}