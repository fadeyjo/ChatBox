import React, { ReactNode } from "react";
import s from "./FormButton.module.css";
import IFormButton from "../../../interfaces/IProps/IFormButton";

export const FormButton: React.FC<IFormButton> = ({
    type,
    children,
    onClick,
}) => {
    return (
        <button className={s.form_button} onClick={onClick} type={type}>
            {children}
        </button>
    );
};
