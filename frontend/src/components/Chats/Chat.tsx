import { Link } from "react-router";
import { ChatObjectType } from "../../types/Chats";



interface Props {
    chat : ChatObjectType
}


const Chat = ({chat} : Props) => {


    return <Link to={`${chat.id}`}>
        {chat.chatName}
    </Link>
}
export default Chat