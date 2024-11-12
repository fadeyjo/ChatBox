import React, { lazy, useContext, useState } from "react";
import s from "./SignInForm.module.css";
import { useFormik } from "formik";
import ISignIn from "../../interfaces/IForms/ISignIn";
import * as Yup from "yup";
import { FormikInput } from "../formik/FormikInput/FormikInput";
import { Context } from "../..";
import { FormButton } from "../UI/FormButton/FormButton";
import { ModalWindow } from "../ModalWindow/ModalWindow";
import { CodeForm } from "../CodeForm/CodeForm";

export const SignInForm: React.FC = () => {
    const [isOpened, setIsOpened] = useState(false);

    const { store } = useContext(Context);

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
            store.login(values);
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
                />
                <FormikInput
                    placeholder="Password"
                    className={s.input}
                    formik={formik}
                    type="password"
                    name="password"
                />
                <FormButton
                    onClick={() => {
                        if (!formik.errors.email && !formik.errors.password) {
                            setIsOpened(true);
                        }
                    }}
                    type="submit"
                >
                    Sign In
                </FormButton>
            </form>
            <ModalWindow
                isOpened={isOpened}
                setIsOpened={setIsOpened}
                header="Code send to your email"
            >
                <CodeForm isOPened={isOpened} />
            </ModalWindow>
        </>
    );
};
