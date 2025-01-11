import { Link } from "react-router";
import { ChatObjectType } from "../../../types/Chats";
import ChatActions from "../ChatActions/ChatActions";



interface Props {
    chat : ChatObjectType
}


const Chat = ({chat} : Props) => {


    return <div>
        <Link to={`${chat.id}`}>
        {chat.chatName}
    </Link>
    <ChatActions chat={chat}/>
    </div>
}
export default Chat