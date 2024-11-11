import { ReactNode } from "react";

export default interface IModalWindow {
    header: string;
    isOpened: boolean;
    setIsOpened: (isOpened: boolean) => void;
    children: ReactNode;
}
