import React from "react";
import s from "./Header.module.css";
import { HeaderLogo } from "../HeaderLogo/HeaderLogo";

export const Header: React.FC = () => {
   return (
      <header className={s.header}>
         <HeaderLogo />
         <div className={s.logout}>Logout</div>
      </header>
   );
};
