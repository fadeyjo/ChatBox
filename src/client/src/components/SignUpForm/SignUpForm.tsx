import React, { useContext } from "react";
import s from "./SignUpForm.module.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FormikInput } from "../formik/FormikInput/FormikInput";
import ISignUp from "../../interfaces/IForms/ISignUp";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const SignUpForm: React.FC = () => {
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
            console.log(values);
            store.registration(values);
        },
        validationSchema,
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <FormikInput formik={formik} type="text" name="lastName" />
            <FormikInput formik={formik} type="text" name="firstName" />
            <FormikInput formik={formik} type="text" name="patronymic" />
            <FormikInput formik={formik} type="email" name="email" />
            <FormikInput formik={formik} type="text" name="nickname" />
            <FormikInput formik={formik} type="password" name="password" />
            <FormikInput
                formik={formik}
                type="password"
                name="repeatPassword"
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default observer(SignUpForm);
