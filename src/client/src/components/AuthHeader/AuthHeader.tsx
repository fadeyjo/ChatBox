import React, { useContext } from "react";
import s from "./AuthHeader.module.css";
import { HeaderLogo } from "../HeaderLogo/HeaderLogo";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const AuthHeader: React.FC = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate()

    const logout = async () => {
        await store.logout();
        navigate("/")
    };

    return (
        <header className={s.header}>
            <HeaderLogo />
            <div className={s.logout} onClick={logout}>
                Logout
            </div>
        </header>
    );
};

export default observer(AuthHeader);
