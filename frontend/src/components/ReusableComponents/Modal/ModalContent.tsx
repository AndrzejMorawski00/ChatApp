import * as Dialog from "@radix-ui/react-dialog";

import * as AlertDialog from "@radix-ui/react-alert-dialog";

// import { Cross2Icon } from "@radix-ui/react-icons";
import { ReactNode } from "react";


interface Props {
    title?: string;
    children: ReactNode;
}

// export const ModalContent = ({ title, children }: Props) => {
//     return (
//         <Dialog.Portal>
//             <Dialog.Overlay className="DialogOverlay">
//                 <Dialog.Description />
//                 <Dialog.Content className="DialogContent">
//                     <div className="flex justify-between items-center px-2 pb-4">
//                         <Dialog.Title className="text-3xl tracking-wider text-white ">{title}</Dialog.Title>
//                         <Dialog.Close asChild>
//                             <Cross2Icon className="w-9 h-9 text-white transition hover:scale-[102%]" />
//                         </Dialog.Close>
//                     </div>
//                     {children}
//                 </Dialog.Content>
//             </Dialog.Overlay>
//         </Dialog.Portal>
//     );
// };


const ModalContent = ({title, children} : Props) => {
    return <AlertDialog.Portal>
        <AlertDialog.Overlay className="DialogOverlay">
            <AlertDialog.Content className="DialogContent">
                {title&&<AlertDialog.Title>{title}</AlertDialog.Title>}
                <AlertDialog.Description></AlertDialog.Description>
                {children}
            </AlertDialog.Content>
        </AlertDialog.Overlay>
    </AlertDialog.Portal>
}

export default ModalContent
