import * as Dialog from "@radix-ui/react-dialog";

import { ReactNode } from "react";
import ModalContent from "./ModalContent";

interface ReusableModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

const ReusableModal = ({ open, onOpenChange, children }: ReusableModalProps) => {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </Dialog.Root>
    );
};

ReusableModal.Close = Dialog.Close;
ReusableModal.Button = Dialog.Trigger;
ReusableModal.Content = ModalContent;
export default ReusableModal;
