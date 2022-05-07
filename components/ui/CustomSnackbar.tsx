import { Alert, Snackbar } from '@mui/material';
import { FC } from 'react';

interface Props {
    message: string;
    isOpen: boolean;
    severity: Severity;

    closeSnackbar: () => void;
}

type Severity = "success" | "info" | "warning" | "error";

export const CustomSnackbar: FC<Props> = ({ message, isOpen, severity = 'success', closeSnackbar }) => {
    return (
        <Snackbar open={ isOpen } autoHideDuration={6000} onClose={ closeSnackbar }>
            <Alert onClose={ closeSnackbar } severity={ severity } sx={{ width: '100%' }}>
                { message }
            </Alert>
        </Snackbar>
    );
};
