import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ReactNode } from "react";


interface Props {
    title?: string;
    children: ReactNode;
}



const ModalContent = ({title, children} : Props) => {
    return <AlertDialog.Portal>
        <AlertDialog.Overlay className="dialogOverlay">
            <AlertDialog.Content className="dialogContent">
                {title&&<AlertDialog.Title className="mb-2 text-2xl tracking-wider text-textColor">{title}:</AlertDialog.Title>}
                <AlertDialog.Description></AlertDialog.Description>
                {children}
            </AlertDialog.Content>
        </AlertDialog.Overlay>
    </AlertDialog.Portal>
}

export default ModalContent
