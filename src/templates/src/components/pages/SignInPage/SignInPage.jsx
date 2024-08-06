import s from "./SignInPage.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import SignInForm from "../../SignInForm/SignInForm";
import API from "../../../API";
import ErrorModalWindow from "../../UI/ErrorModalWindow/ErrorModalWindow";
import { useContext, useState } from "react";
import AuthContext from "../../../context";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
    const [error, setError] = useState("");
    const {customer, setCustomer} = useContext(AuthContext);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        onSubmit: async customer => {
            const data = await API.authCustomer(customer);
            if (data.error) {
                setError(data.error);
            }
            else {  
                setCustomer(data);
                navigate('/profile');
            }
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email("Incorrect email")
                .required("Required"),
            password: Yup.string()
                .min(2, "Must be longer")
                .max(20, "Must be shorter")
                .required("Required"),
        })
    });

    return (
        <div className={s.container}>
            <div className={s.form}>
                <div className={s.title}>Sign In</div>
                <SignInForm formik={formik} />
                <ErrorModalWindow error={error} setError={setError} />
            </div>
        </div>
    )
}