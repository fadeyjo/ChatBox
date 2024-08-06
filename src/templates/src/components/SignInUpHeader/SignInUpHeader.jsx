import { useLocation } from "react-router-dom";
import Logo from "../Logo/Logo";
import HeaderLink from "../UI/HeaderLink/HeaderLink";
import s from "./SignInUpHeader.module.css";

export default function SignInUpHeader() {
    const currentPathname = useLocation().pathname;
    const [linkTo, text] = currentPathname === "/signin" ? ["/signup", "Sign Up"] : ["/signin", "Sign In"];
    return (
        <header className={s.header}>
            <Logo />
            <HeaderLink linkTo={linkTo}>{text}</HeaderLink>
        </header>
    )
}