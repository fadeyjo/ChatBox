import React from "react";
import s from "./FormButton.module.css";
import IFormButton from "../../../interfaces/IProps/IFormButton";
import classNames from "classnames";

export const FormButton: React.FC<IFormButton> = ({
    type,
    children,
    onClick,
    className,
}) => {
    return (
        <button
            className={classNames(s.form_button, className)}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
};
