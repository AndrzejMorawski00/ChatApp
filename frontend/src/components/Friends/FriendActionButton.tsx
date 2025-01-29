import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { SignalRActionHandler } from "../../types/signalRActions";
import { twMerge } from "tailwind-merge";

interface Props {
    handleSignalRAction: SignalRActionHandler;
    actionName: string;
    actionParameter: any;
    icon: IconDefinition;
    hoverColor: string;
}

const FriendActionButton = ({ handleSignalRAction, actionName, actionParameter, icon, hoverColor }: Props) => {
    return (
        <button onClick={async () => await handleSignalRAction(actionName, actionParameter)}>
            <FontAwesomeIcon
                icon={icon}
                className={twMerge(
                    hoverColor,
                    "transition duration-300 size-4 text-iconColor transfrom hover:scale-105"
                )}
            />
        </button>
    );
};

export default FriendActionButton;
