import React from "react";
import s from "./SideBar.module.css";
import { SideBarElement } from "../UI/SideBarElement/SideBarElement";
import { ImProfile } from "react-icons/im";
import { BsPostcard } from "react-icons/bs";
import { LuMessageSquare } from "react-icons/lu";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { BsFillPeopleFill } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export const SideBar: React.FC = () => {
    const navigate = useNavigate();
    return (
        <nav className={s.nav_bar}>
            <SideBarElement onClick={() => {navigate("/profile")}}>
                <ImProfile /> Profile
            </SideBarElement>
            <SideBarElement onClick={() => {navigate("/posts")}}>
                <BsPostcard /> Posts
            </SideBarElement>
            <SideBarElement onClick={() => {navigate("/chats")}}>
                <LuMessageSquare /> Messages
            </SideBarElement>
            <SideBarElement onClick={() => {navigate("/friends")}}>
                <LiaUserFriendsSolid /> Friends
            </SideBarElement>
            <SideBarElement onClick={() => {navigate("/subscribers")}}>
                <BsPeople /> Subscribers
            </SideBarElement>
            <SideBarElement onClick={() => {navigate("/subscribes")}}>
                <BsFillPeopleFill /> My subscribes
            </SideBarElement>
        </nav>
    );
};
