import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../..";
import { FriendsPage } from "../FriendsPage/FriendsPage";

export const BufFriendsPage: React.FC = () => {
    const { userId } = useParams();
    const { store } = useContext(Context);

    return (
        <>
            <FriendsPage userId={userId ? Number(userId) : store.user.userId} />
        </>
    );
};
