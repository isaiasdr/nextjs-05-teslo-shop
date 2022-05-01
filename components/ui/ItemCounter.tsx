import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';


interface Props {
    currentValue: number;
    updatedQuantity: ( quantity: number ) => void;
    maxValue: number;
}

export const ItemCounter: FC<Props> = ({ currentValue, updatedQuantity, maxValue }) => {

    const handleAdd = () => {
        if( currentValue < maxValue )
            updatedQuantity( currentValue + 1 );
    }

    const handleRemove = () => {
        if( currentValue > 1 )
            updatedQuantity( currentValue - 1);
    }

    return (
        <Box display='flex' alignItems='center'>
            <IconButton onClick={ handleRemove } >
                <RemoveCircleOutlineOutlinedIcon />
            </IconButton>

            <Typography sx={{ width: 40, textAlign: 'center' }}>
                { currentValue }
            </Typography>

            <IconButton onClick={ handleAdd } >
                <AddCircleOutlineOutlinedIcon />
            </IconButton>
        </Box>
    )
}