import InputProperty from "../UI/InputProperty/InputProperty";
import Button from "../UI/Button/Button";
import s from "./SignUpForm.module.css";

export default function SignUpForm({formik}) {
    return (
        <form onSubmit={formik.handleSubmit} className={s.inputs_container}>
            <InputProperty
                name="surname"
                type="text"
                formik={formik}
                text="Surname:"
            />
            <InputProperty
                name="name"
                type="text"
                formik={formik}
                text="Name:"
            />
            <InputProperty
                name="patronymic"
                type="text"
                formik={formik}
                text="Patronymic:"
            />
            <InputProperty
                name="email"
                type="email"
                formik={formik}
                text="Email:"
            />
            <InputProperty
                name="birthday"
                type="date"
                formik={formik}
                text="Birthday:"
            />
            <InputProperty
                name="password"
                type="password"
                formik={formik}
                text="Password:"
            />
            <InputProperty
                name="repeatPassword"
                type="password"
                formik={formik}
                text="Repeat password:"
            />
            <Button
                type="submit"
            >
                Sign Up
            </Button>
        </form>
    )
}