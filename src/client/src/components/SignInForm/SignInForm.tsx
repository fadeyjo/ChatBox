import React, { useContext, useState } from "react";
import s from "./SignInForm.module.css";
import { useFormik } from "formik";
import ISignIn from "../../interfaces/IForms/ISignIn";
import * as Yup from "yup";
import { FormikInput } from "../formik/FormikInput/FormikInput";
import { Context } from "../..";
import { FormButton } from "../UI/FormButton/FormButton";
import ISignInUp from "../../interfaces/IProps/ISignInUp";
import { observer } from "mobx-react-lite";

const SignInForm: React.FC<ISignInUp> = ({ setIsOpened, setEmail }) => {
    const { store } = useContext(Context);
    const [error, setError] = useState("");

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const formik = useFormik<ISignIn>({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: (values) => {
            store.login(values, setError, setIsOpened, setEmail);
        },
        validationSchema,
    });

    return (
        <>
            <form className={s.form} onSubmit={formik.handleSubmit}>
                <FormikInput
                    placeholder="Email"
                    className={s.input}
                    formik={formik}
                    type="email"
                    name="email"
                    onChange={() => setError("")}
                />
                <FormikInput
                    placeholder="Password"
                    className={s.input}
                    formik={formik}
                    type="password"
                    name="password"
                    onChange={() => setError("")}
                />
                <div className={s.error}>{error}</div>
                <FormButton type="submit">Sign In</FormButton>
            </form>
        </>
    );
};

export default observer(SignInForm);
