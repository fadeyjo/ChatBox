import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthenticationPage } from "./components/AuthenticationPage/AuthenticationPage";
import { Header } from "./components/Header/Header";

export default function App() {
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
