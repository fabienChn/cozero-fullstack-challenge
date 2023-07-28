import { Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react"
import React from "react"
import { translate } from "../utils/language.utils"

interface Props {
    isOpen: boolean
    actionType: 'delete' | 'restore';
    onClose: () => void
    onExectuteAction: () => void
}

export default function ActionOnProjectConfirmation({ isOpen, actionType, onClose, onExectuteAction }: Props) {
    const cancelRef = React.useRef(null)

    const headerText = translate(actionType === 'restore' ? 'RESTORE_PROJECT' : 'DELETE_PROJECT');
    const bodyText = translate(actionType === 'restore' ? 'RESTORE_PROJECT_DESCRIPTION' : 'DELETE_PROJECT_DESCRIPTION');

    return (
        <>
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>{headerText}</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        {bodyText}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            {translate('NO')}
                        </Button>
                        <Button colorScheme='red' ml={3} onClick={onExectuteAction}>
                            {translate('YES')}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}