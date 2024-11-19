import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import ProfilePage from "../ProfilePage/ProfilePage";
import { Context } from "../..";
import { observer } from "mobx-react-lite";

const BufProfilePage: React.FC = () => {
    const { userId } = useParams();
    const { store } = useContext(Context);

    return (
        <>
            <ProfilePage userId={userId ? Number(userId) : store.user.userId} />
        </>
    );
};

export default observer(BufProfilePage);
