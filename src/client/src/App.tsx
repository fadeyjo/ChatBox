import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthenticationPage } from "./components/AuthenticationPage/AuthenticationPage";
import { useContext, useEffect } from "react";
import { Context } from ".";
import { observer } from "mobx-react-lite";
import { NotAuthHeader } from "./components/NotAuthHeader/NotAuthHeader";
import AuthHeader from "./components/AuthHeader/AuthHeader";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import { SideBar } from "./components/SideBar/SideBar";
import BufProfilePage from "./components/BufProfilePage/BufProfilePage";

function App() {
    const { store } = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            store.checkAuthorization();
        }
    }, []);

    if (store.isAuth) {
        return (
            <BrowserRouter>
                <div className="auth_header_content">
                    <AuthHeader />
                    <div className="auth_content_sidebar">
                        <SideBar />
                        <div className="auth_content">
                            <Routes>
                                <Route
                                    path="/"
                                    element={<Navigate to="/profile" replace />}
                                />
                                <Route
                                    path="/:userId"
                                    element={<BufProfilePage />}
                                />
                                <Route
                                    path="/profile"
                                    element={<BufProfilePage />}
                                />
                            </Routes>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <NotAuthHeader />
            <div className="content">
                <Routes>
                    <Route path="/" element={<AuthenticationPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default observer(App);
