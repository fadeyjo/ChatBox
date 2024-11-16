import { ReactNode } from "react";

export default interface IFormButton {
    type: "submit" | "reset" | "button" | undefined;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}
