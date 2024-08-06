import { Outlet } from "react-router-dom";
import SignInUpHeader from "../SignInUpHeader/SignInUpHeader";

export default function IsAuthDashBoard() {
    return (
        <>
            <SignInUpHeader />
            <Outlet />
        </>
    )
}