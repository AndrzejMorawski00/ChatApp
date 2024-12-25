// import { useSelector } from "react-redux";
// import useGetRequest from "../../api/useGetRequest/useGetRequest";
// import { StoreState } from "../../redux/store";
// import { useEffect, useState } from "react";
import { HandleAddFriend } from "../../types/Friends";
import { UserData } from "../../types/Users";
import UserItem from "./UserItem";

interface Props {
    users: UserData[];
    isLoading: boolean;
    isError: boolean;
    handleAddFriend : HandleAddFriend
}

const UserList = ({ users, isLoading, isError, handleAddFriend }: Props) => {
    if (isLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <p>Error</p>
            </div>
        );
    }

    return (
        <ul>
            {users.map((user, idx) => (
                <UserItem key={idx} user={user} handleAddFriend={handleAddFriend}/>
            ))}
        </ul>
    );
    return <ul></ul>;
};

export default UserList;
