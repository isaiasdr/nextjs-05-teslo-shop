import { Backdrop, CircularProgress } from "@mui/material";

export const LoadingScreen = () => {
    return (
        <>
            <Backdrop
                sx={{ color: '#fff' }}
                open={ true }
            >
                <CircularProgress size={60} color="inherit" />
            </Backdrop>
        </>
    )
}
