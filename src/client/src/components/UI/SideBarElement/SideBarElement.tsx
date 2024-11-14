import React from "react";
import s from "./SideBarElement.module.css";
import ISideBarElement from "../../../interfaces/IProps/ISideBarElement";

export const SideBarElement: React.FC<ISideBarElement> = ({ children, onClick }) => {
    return <div onClick={onClick} className={s.side_bar_element}>{children}</div>;
};
