import s from "./FormikInput.module.css";
import { FormikProps } from "formik";

export const FormikInput = <T extends object>({
    formik,
    name,
    type,
}: {
    formik: FormikProps<T>;
    type: string;
    name: keyof T;
}) => {
    return (
        <>
            <input
                name={String(name)}
                type={type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={String(formik.values[name] ?? "")}
            />
            {formik.touched[name] && formik.errors[name] ? (
                <div>{String(formik.errors[name])}</div>
            ) : null}
        </>
    );
};
