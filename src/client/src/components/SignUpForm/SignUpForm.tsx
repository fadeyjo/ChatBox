import React, { useContext, useState } from "react";
import s from "./SignUpForm.module.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormikInput } from "../formik/FormikInput/FormikInput";
import ISignUp from "../../interfaces/IForms/ISignUp";
import { Context } from "../..";
import { FormButton } from "../UI/FormButton/FormButton";
import ISignInUp from "../../interfaces/IProps/ISignInUp";
import { observer } from "mobx-react-lite";

const SignUpForm: React.FC<ISignInUp> = ({ setIsOpened, setEmail }) => {
    const [error, setError] = useState("");

    const { store } = useContext(Context);

    const validationSchema = Yup.object({
        lastName: Yup.string()
            .required("Last name is required")
            .test("Is valid last name", "Invalid last name", (lastName) => {
                if (new RegExp("^[A-ZА-Я][a-zа-я]{2,49}$").test(lastName)) {
                    return true;
                }
                return false;
            }),
        firstName: Yup.string()
            .required("First name is required")
            .test("Is valid first name", "Invalid first name", (firstName) => {
                if (new RegExp("^[A-ZА-Я][a-zа-я]{2,49}$").test(firstName)) {
                    return true;
                }
                return false;
            }),
        patronymic: Yup.string().test(
            "Is valid patronymic",
            "Invalid patronymic",
            (patronymic) => {
                if (!patronymic) {
                    return true;
                }
                if (new RegExp("^[A-ZА-Я][a-zа-я]{2,49}$").test(patronymic)) {
                    return true;
                }
                return false;
            }
        ),
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        nickname: Yup.string()
            .required("Nickname is required")
            .test("Is valid nickname", "Invalid nickname", (nickname) => {
                if (new RegExp("^[A-Za-z0-9]{3,50}$").test(nickname)) {
                    return true;
                }
                return false;
            }),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Must be longer")
            .max(50, "Must be shorter"),
        repeatPassword: Yup.string()
            .required("Repeat password is required")
            .test(
                "Passwords are equal",
                "Passwords aren't equal",
                function (repeatPassword) {
                    const password = String(this.parent.password);
                    return password === repeatPassword;
                }
            )
            .min(8, "Must be longer")
            .max(50, "Must be shorter"),
    });

    const formik = useFormik<ISignUp>({
        initialValues: {
            lastName: "",
            firstName: "",
            patronymic: "",
            email: "",
            nickname: "",
            password: "",
            repeatPassword: "",
        },
        onSubmit: (values) => {
            store.registration(values, setError, setIsOpened, setEmail);
        },
        validationSchema,
    });

    return (
        <>
            <form onSubmit={formik.handleSubmit} className={s.form}>
                <FormikInput
                    placeholder="Last name"
                    className={s.input}
                    formik={formik}
                    type="text"
                    name="lastName"
                    onChange={() => setError("")}
                />
                <FormikInput
                    placeholder="First name"
                    className={s.input}
                    formik={formik}
                    type="text"
                    name="firstName"
                    onChange={() => setError("")}
                />
                <FormikInput
                    placeholder="Patronymic (if available)"
                    className={s.input}
                    formik={formik}
                    type="text"
                    name="patronymic"
                    onChange={() => setError("")}
                />
                <FormikInput
                    placeholder="Email"
                    className={s.input}
                    formik={formik}
                    type="email"
                    name="email"
                    onChange={() => setError("")}
                />
                <FormikInput
                    placeholder="Nickname"
                    className={s.input}
                    formik={formik}
                    type="text"
                    name="nickname"
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
                <FormikInput
                    placeholder="Repeat password"
                    formik={formik}
                    type="password"
                    name="repeatPassword"
                    className={s.input}
                    onChange={() => setError("")}
                />
                <div className={s.error}>{error}</div>
                <FormButton type="submit">Sign Up</FormButton>
            </form>
        </>
    );
};

export default observer(SignUpForm);
