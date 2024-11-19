import React, { useContext } from "react";
import s from "./BufSubscribersPage.module.css";
import { useParams } from "react-router-dom";
import { Context } from "../..";
import { SubscribersPage } from "../SubscribersPage/SubscribersPage";

export const BufSubscribersPage: React.FC = () => {
    const { userId } = useParams();
    const { store } = useContext(Context);

    return (
        <>
            <SubscribersPage userId={userId ? Number(userId) : store.user.userId} />
        </>
    );
};
