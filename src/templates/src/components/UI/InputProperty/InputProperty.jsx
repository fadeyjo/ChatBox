import s from "./InputProperty.module.css";

export default function InputProperty({type, name, formik, text}) {
    return (
        <div>
            <div className={s.property}>
                <label htmlFor={name} className={s.label}>{text}</label>
                <input
                    type={type}
                    name={name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[name]}
                    className={s.input}
                />
            </div>
            {formik.touched[name] && formik.errors[name] ? (
                <div className={s.error}>
                    {formik.errors[name]}
                </div>
            ) : (
                <div className={s.error}></div>
            )}
        </div>
    )
}