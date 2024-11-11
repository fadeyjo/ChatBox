import React from "react";
import s from "./SignInUp.module.css";
import { SignInForm } from "../SignInForm/SignInForm";
import SignUpForm from "../SignUpForm/SignUpForm";

export const SignInUp: React.FC = () => {
    return (
        <>
            <SignInForm />
            <SignUpForm />
        </>
    );
};
