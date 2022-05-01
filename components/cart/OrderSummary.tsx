import { FC, useContext } from 'react'
import { Grid, Typography } from '@mui/material';

import { currency } from '../../utils';
import { CartContext } from '../../context';

interface Props {
    orderValues?: {
        numberOfItems: number;
        subtotal: number;
        taxRate: number;
        total: number;
    }
};

export const OrderSummary: FC<Props> = ({ orderValues }) => {

    const { numberOfItems, subtotal, taxRate, total } = orderValues || useContext( CartContext );

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>
                    No. Productos
                </Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>
                    { numberOfItems } { numberOfItems > 1 ? 'Items' : 'Item' }
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>
                    SubTotal
                </Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>
                    { currency.format( subtotal ) }
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>
                    Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE || 0 ) * 100 }%)
                </Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>
                    { currency.format( taxRate ) }
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography variant='subtitle1'>
                    Total:
                </Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography variant='subtitle1'>
                    { currency.format( total ) }
                </Typography>
            </Grid>
        </Grid>
    );
};
