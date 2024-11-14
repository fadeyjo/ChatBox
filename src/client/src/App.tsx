import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthenticationPage } from "./components/AuthenticationPage/AuthenticationPage";
import { useContext, useEffect } from "react";
import { Context } from ".";
import { observer } from "mobx-react-lite";
import { NotAuthHeader } from "./components/NotAuthHeader/NotAuthHeader";
import AuthHeader from "./components/AuthHeader/AuthHeader";
import SelfProfilePage from "./components/SelfProfilePage/SelfProfilePage";
import { SideBar } from "./components/SideBar/SideBar";

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
                                    path="/profile"
                                    element={<SelfProfilePage />}
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
