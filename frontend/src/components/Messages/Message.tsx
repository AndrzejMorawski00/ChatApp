import { MessageType } from "../../types/messages";


interface Props {
    message : MessageType,
    fetchNextRef?: React.Ref<HTMLLIElement>;
}

const Message = ({message, fetchNextRef} : Props) => {

    return <li ref={fetchNextRef? fetchNextRef : null}>{message.content}</li>
} 

export default Message