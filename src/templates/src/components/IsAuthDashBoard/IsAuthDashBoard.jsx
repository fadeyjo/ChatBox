import { Outlet } from "react-router-dom";
import AuthHeader from "../AuthHeader/AuthHeader";

export default function IsAuthDashBoard() {
    return (
        <>
            <AuthHeader />
            <Outlet />
        </>
    )
}