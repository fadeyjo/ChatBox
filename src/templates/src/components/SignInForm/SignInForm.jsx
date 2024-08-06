import InputProperty from "../UI/InputProperty/InputProperty";
import Button from "../UI/Button/Button";
import s from "./SignInForm.module.css";

export default function SignUpForm({formik}) {
    return (
        <form onSubmit={formik.handleSubmit} className={s.inputs_container}>
            <InputProperty
                name="email"
                type="email"
                formik={formik}
                text="Email:"
            />
            <InputProperty
                name="password"
                type="password"
                formik={formik}
                text="Password:"
            />
            <Button
                type="submit"
            >
                Sign In
            </Button>
        </form>
    )
}