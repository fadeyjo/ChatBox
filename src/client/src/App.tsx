import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthenticationPage } from "./components/AuthenticationPage/AuthenticationPage";
import { useContext, useEffect } from "react";
import { Context } from ".";
import { observer } from "mobx-react-lite";
import { NotAuthHeader } from "./components/NotAuthHeader/NotAuthHeader";
import AuthHeader from "./components/AuthHeader/AuthHeader";
import { SideBar } from "./components/SideBar/SideBar";
import BufProfilePage from "./components/BufProfilePage/BufProfilePage";
import { BufFriendsPage } from "./components/BufFriendsPage/BufFriendsPage";
import { BufSubscribersPage } from "./components/BufSubscribersPage/BufSubscribersPage";
import { BufSubscribesPage } from "./components/BufSubscribesPage/BufSubscribesPage";
import { PostsPage } from "./components/PostsPage/PostsPage";
import { ChatsPage } from "./components/ChatsPage/ChatsPage";
import { Chat } from "./components/Chat/Chat";

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
                                    path="/profile/:userId"
                                    element={<BufProfilePage />}
                                />
                                <Route
                                    path="/profile"
                                    element={<BufProfilePage />}
                                />
                                <Route
                                    path="/friends"
                                    element={<BufFriendsPage />}
                                />
                                <Route
                                    path="/friends/:userId"
                                    element={<BufFriendsPage />}
                                />
                                <Route
                                    path="/subscribers"
                                    element={<BufSubscribersPage />}
                                />
                                <Route
                                    path="/subscribers/:userId"
                                    element={<BufSubscribersPage />}
                                />
                                <Route
                                    path="/subscribes"
                                    element={<BufSubscribesPage />}
                                />
                                <Route
                                    path="/subscribes/:userId"
                                    element={<BufSubscribesPage />}
                                />
                                <Route
                                    path="/posts"
                                    element={<PostsPage />}
                                />
                                <Route
                                    path="/chats"
                                    element={<ChatsPage />}
                                />
                                <Route
                                    path="/chats/:chatId"
                                    element={<Chat />}
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
