import { ReactNode } from "react";
import { FriendColumnNames, FriendData } from "../../types/Friends";
import { UserData } from "../../types/Users";
import { faX, faCheck } from "@fortawesome/free-solid-svg-icons";
import { ACCEPT_FRIEND_ACTION, REMOVE_FRIEND_ACTION } from "../../constants/signalRActions";
import { FRIEND_COLUMNS } from "../../constants/Friends";
import FriendActionButton from "./FriendActionButton";
import useSignalRAction from "../../api/signalR/signalRActions";
import { SignalRActionHandler } from "../../types/signalRActions";

interface Props {
    friendship: { id: number; userData: UserData };
    actions: FriendColumnNames;
}

const getActions = (
    handleSignalRAction: SignalRActionHandler,
    friendship: FriendData,
    actions: FriendColumnNames
): ReactNode => {
    switch (actions) {
        case FRIEND_COLUMNS.accepted:
            return (
                <FriendActionButton
                    actionName={REMOVE_FRIEND_ACTION}
                    actionParameter={friendship.id}
                    icon={faX}
                    handleSignalRAction={handleSignalRAction}
                />
            );
        case FRIEND_COLUMNS.received:
            return (
                <>
                    <FriendActionButton
                        actionName={ACCEPT_FRIEND_ACTION}
                        actionParameter={friendship.id}
                        icon={faCheck}
                        handleSignalRAction={handleSignalRAction}
                    />
                    <FriendActionButton
                        actionName={REMOVE_FRIEND_ACTION}
                        actionParameter={friendship.id}
                        icon={faX}
                        handleSignalRAction={handleSignalRAction}
                    />
                </>
            );

        case FRIEND_COLUMNS.sent:
            return (
                <FriendActionButton
                    actionName={REMOVE_FRIEND_ACTION}
                    actionParameter={friendship.id}
                    icon={faX}
                    handleSignalRAction={handleSignalRAction}
                />
            );

        default:
            return <></>;
    }
};

const FriendItem = ({ friendship, actions }: Props) => {
    const { handleSignalRAction } = useSignalRAction();

    return (
        <li className="flex flex-col">
            <div className="flex items-center justify-center gap-2">
                <p className="text-xl tracking-wider text-textColor w-fit">{friendship.userData.firstName}</p>
                <p className="text-xl tracking-wider text-textColor w-fit">{friendship.userData.lastName}</p>
            </div>
            <div className="flex items-center justify-center gap-4">
                {getActions(handleSignalRAction, friendship, actions)}
            </div>
        </li>
    );
};

export default FriendItem;
