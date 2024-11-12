import React, { useState } from "react";
import s from "./SignInUp.module.css";
import SignInForm from "../SignInForm/SignInForm";
import SignUpForm from "../SignUpForm/SignUpForm";
import classNames from "classnames";
import { ModalWindow } from "../ModalWindow/ModalWindow";
import CodeForm from "../CodeForm/CodeForm";

export const SignInUp: React.FC = () => {
    const [isSignInSelected, setIsSignInSelected] = useState(true);
    const [isOpened, setIsOpened] = useState(false);
    const [email, setEmail] = useState("");

    return (
        <div className={s.container}>
            <div className={s.auth_buttons_container}>
                <div
                    onClick={() => setIsSignInSelected(true)}
                    className={classNames(s.auth_buttons, s.sign_in_button, {
                        [s.selected]: isSignInSelected,
                    })}
                >
                    Sign In
                </div>
                <div
                    onClick={() => setIsSignInSelected(false)}
                    className={classNames(s.auth_buttons, s.sign_up_button, {
                        [s.selected]: !isSignInSelected,
                    })}
                >
                    Sign Up
                </div>
            </div>
            <div className={s.selected_form}>
                {isSignInSelected ? (
                    <SignInForm setIsOpened={setIsOpened} setEmail={setEmail} />
                ) : (
                    <SignUpForm setIsOpened={setIsOpened} setEmail={setEmail} />
                )}
            </div>
            <ModalWindow
                isOpened={isOpened}
                setIsOpened={setIsOpened}
                header="Code send to your email"
            >
                <CodeForm isOpened={isOpened} length={6} email={email} />
            </ModalWindow>
        </div>
    );
};
