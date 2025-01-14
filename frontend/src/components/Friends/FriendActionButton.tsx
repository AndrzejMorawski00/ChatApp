import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { SignalRActionHandler } from "../../types/signalRActions";

interface Props {
    handleSignalRAction: SignalRActionHandler;
    actionName: string;
    actionParameter: any;
    icon: IconDefinition;
}

const FriendActionButton = ({ handleSignalRAction, actionName, actionParameter, icon }: Props) => {
    return (
        <button onClick={async () => await handleSignalRAction(actionName, actionParameter)}>
            <FontAwesomeIcon
                icon={icon}
                className="transition duration-300 size-4 text-iconColor hover:text-iconColorHover transfrom hover:scale-105"
            />
        </button>
    );
};

export default FriendActionButton;
