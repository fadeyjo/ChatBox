import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthenticationPage } from "./components/AuthenticationPage/AuthenticationPage";
import { Header } from "./components/Header/Header";
import { useContext, useEffect } from "react";
import { Context } from ".";
import { observer } from "mobx-react-lite";

function App() {
    const { store } = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            store.checkAuthorization();
        }
    }, [store]);

    if (store.isAuth) {
        return <div>is auth</div>;
    }

    return (
        <BrowserRouter>
            <Header />
            <div className="content">
                <Routes>
                    <Route
                        path="/authentication"
                        element={<AuthenticationPage />}
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default observer(App);
