import Logo from "../Logo/Logo";
import s from "./AuthHeader.module.css";
import HeaderButton from "../UI/HeaderButton/HeaderButton";
import { useContext } from "react";
import AuthContext from "../../context/index";
import { useNavigate } from "react-router-dom";

export default function AuthHeader() {
    const {customer, setCustomer} = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <header className={s.header}>
            <Logo />
            <HeaderButton
                onClick={() => {
                    setCustomer({});
                    navigate("/signin");
                }}
            >
                Log Out
            </HeaderButton>
        </header>
    )
}