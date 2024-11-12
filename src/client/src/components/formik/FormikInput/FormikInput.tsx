import s from "./FormikInput.module.css";
import { FormikProps } from "formik";

export const FormikInput = <T extends object>({
    formik,
    name,
    type,
    className,
    placeholder,
    onChange,
}: {
    formik: FormikProps<T>;
    type: string;
    name: keyof T;
    className: string;
    placeholder: string;
    onChange: () => void;
}) => {
    return (
        <>
            <input
                placeholder={placeholder}
                className={className}
                name={String(name)}
                type={type}
                onChange={(event) => {
                    formik.handleChange(event);
                    onChange();
                }}
                onBlur={formik.handleBlur}
                value={String(formik.values[name] ?? "")}
            />
            <div className={s.error}>
                {formik.touched[name] && formik.errors[name] ? (
                    <div>{String(formik.errors[name])}</div>
                ) : (
                    ""
                )}
            </div>
        </>
    );
};
