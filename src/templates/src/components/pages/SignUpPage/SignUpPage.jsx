import s from "./SignUpPage.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import SignUpForm from "../../SignUpForm/SignUpForm";
import API from "../../../API";
import ErrorModalWindow from "../../UI/ErrorModalWindow/ErrorModalWindow";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function getMaxBirthdayDate() {
        const todayDate = new Date();
        const birthdayDay = todayDate.getDate();
        const birthdayMonth = todayDate.getMonth() + 1;
        const birthdayYear = todayDate.getFullYear() - 14;
        return `${birthdayYear}-${birthdayMonth < 10 ? "0" + birthdayMonth : birthdayMonth}-${birthdayDay < 10 ? "0" + birthdayDay : birthdayDay}`;
    }

    const formik = useFormik({
        initialValues: {
            surname: "",
            name: "",
            patronymic: "",
            email: "",
            birthday: getMaxBirthdayDate(),
            password: "",
            repeatPassword: ""
        },
        onSubmit: async (customer) => {
            const data = await API.createCustomer(customer);
            if (data.error) {
                setError(data.error);
            }
            else {
                navigate("/signin")
            }
        },
        validationSchema: Yup.object().shape({
            surname: Yup.string()
                .min(2, "Must be longer")
                .max(20, "Must be shorter")
                .matches(/^[A-Z]{1}[a-z]{1,19}$/, "Incorrect format")
                .required("Required"),
            name: Yup.string()
                .min(2, "Must be longer")
                .max(20, "Must be shorter")
                .matches(/^[A-Z]{1}[a-z]{1,19}$/, "Incorrect format")
                .required("Required"),
            patronymic: Yup.string()
                .min(2, "Must be longer")
                .max(20, "Must be shorter")
                .matches(/^[A-Z]{1}[a-z]{1,19}$/, "Incorrect format")
                .required("Required"),
            email: Yup.string()
                .email("Incorrect email")
                .required("Required"),
            password: Yup.string()
                .min(2, "Must be longer")
                .max(20, "Must be shorter")
                .required("Required"),
            repeatPassword: Yup.string()
                .min(2, "Must be longer")
                .max(20, "Must be shorter")
                .required("Required")
                .test("aaa", "Passwords not equal", (repeatPassword, values) => repeatPassword === values.parent.password)
        })
    });

    return (
        <div className={s.container}>
            <div className={s.form}>
                <div className={s.title}>Sign Up</div>
                <SignUpForm formik={formik} />
                <ErrorModalWindow error={error} setError={setError} />
            </div>
        </div>
    )
}