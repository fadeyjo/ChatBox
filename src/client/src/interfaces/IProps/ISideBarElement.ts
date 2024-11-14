import { ReactNode } from "react";

export default interface ISideBarElement {
    children: ReactNode;
    onClick: () => void;
}
