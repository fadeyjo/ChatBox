import React from "react";
import s from "./NotAuthHeader.module.css";
import { HeaderLogo } from "../HeaderLogo/HeaderLogo";

export const NotAuthHeader: React.FC = () => {
   return (
      <header className={s.header}>
         <HeaderLogo />
      </header>
   );
};
