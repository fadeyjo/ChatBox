import React, { useState } from "react";
import s from "./SignInUp.module.css";
import { SignInForm } from "../SignInForm/SignInForm";
import SignUpForm from "../SignUpForm/SignUpForm";
import { boolean } from "yup";
import classNames from "classnames";

export const SignInUp: React.FC = () => {
    const [isSignInSelected, setIsSignInSelected] = useState(true);
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
                {isSignInSelected ? <SignInForm /> : <SignUpForm />}
            </div>
        </div>
    );
};
