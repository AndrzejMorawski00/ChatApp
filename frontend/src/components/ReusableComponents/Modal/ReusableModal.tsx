// import * as Dialog from "@radix-ui/react-dialog";

import * as AlertDialog from "@radix-ui/react-alert-dialog";


import { ReactNode } from "react";
import ModalContent from "./ModalContent";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

// const ReusableModal = ({ open, onOpenChange, children }: Props) => {
//     return (
//         <Dialog.Root open={open} onOpenChange={onOpenChange}>
//             {children}
//         </Dialog.Root>
//     );
// };

// ReusableModal.Close = Dialog.Close;
// ReusableModal.Button = Dialog.Trigger;
// ReusableModal.Content = ModalContent;


const ReusableModal = ({open, onOpenChange, children} : Props) => {
    return <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
        {children}
    </AlertDialog.Root>
}

ReusableModal.Action = AlertDialog.Action;
ReusableModal.Button = AlertDialog.Trigger;
ReusableModal.Content = ModalContent
export default ReusableModal;