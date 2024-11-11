import React, { useContext } from "react";
import s from "./SignInForm.module.css";
import { useFormik } from "formik";
import ISignIn from "../../interfaces/IForms/ISignIn";
import * as Yup from "yup";
import { FormikInput } from "../formik/FormikInput/FormikInput";
import { Context } from "../..";

export const SignInForm: React.FC = () => {
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
        <form onSubmit={formik.handleSubmit}>
            <FormikInput formik={formik} type="email" name="email" />
            <FormikInput formik={formik} type="password" name="password" />

            <button type="submit">Submit</button>
        </form>
    );
};
