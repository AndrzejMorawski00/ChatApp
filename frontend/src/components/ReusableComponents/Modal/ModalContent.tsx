import * as AlertDialog from "@radix-ui/react-alert-dialog";

// import { Cross2Icon } from "@radix-ui/react-icons";
import { ReactNode } from "react";


interface Props {
    title?: string;
    children: ReactNode;
}



const ModalContent = ({title, children} : Props) => {
    return <AlertDialog.Portal>
        <AlertDialog.Overlay className="DialogOverlay">
            <AlertDialog.Content className="DialogContent">
                {title&&<AlertDialog.Title className="text-2xl text-textColor tracking-wider mb-2">{title}:</AlertDialog.Title>}
                <AlertDialog.Description></AlertDialog.Description>
                {children}
            </AlertDialog.Content>
        </AlertDialog.Overlay>
    </AlertDialog.Portal>
}

export default ModalContent
