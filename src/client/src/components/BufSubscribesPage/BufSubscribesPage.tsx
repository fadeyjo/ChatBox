import React, { useContext } from "react";
import s from "./BufSubscribesPage.module.css";
import { useParams } from "react-router-dom";
import { Context } from "../..";
import { SubscribesPage } from "../SubscribesPage/SubscribesPage";

export const BufSubscribesPage: React.FC = () => {
   const { userId } = useParams();
    const { store } = useContext(Context);

    return (
        <>
            <SubscribesPage userId={userId ? Number(userId) : store.user.userId} />
        </>
    );
};
