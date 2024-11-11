import React, { MouseEvent } from "react";
import s from "./ModalWindow.module.css";
import IModalWindow from "../../interfaces/IProps/IModalWindow";
import classNames from "classnames";
import { IoClose } from "react-icons/io5";

export const ModalWindow: React.FC<IModalWindow> = ({
    children,
    header,
    isOpened,
    setIsOpened,
}) => {
    const closeWindowByBackground = (
        event: MouseEvent<HTMLDivElement | any>
    ) => {
        if (event.target === event.currentTarget) {
            event.stopPropagation();
            setIsOpened(false);
        }
    };

    const closeWindowByClose = () => {
        setIsOpened(false);
    };

    return (
        <div
            className={classNames(s.modal, { [s.open]: isOpened })}
            onClick={closeWindowByBackground}
        >
            <div className={s.content}>
                <IoClose className={s.close} onClick={closeWindowByClose} />
                <div className={s.header}>{header}</div>
                {children}
            </div>
        </div>
    );
};
