import { CartContext } from "@component/context"
import { currency } from "@component/utils";
import { Grid, Typography } from "@mui/material"
import { FC, useContext } from "react"

interface Props {
    orderValues?: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
    }
}

export const OrderSummary: FC<Props> = ({ orderValues }) => {

    const { numberOfItems, subTotal, total, tax, } = useContext(CartContext);

    const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, tax, total };


    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>Nro. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{summaryValues.numberOfItems} {summaryValues.numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>SubTotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.fotmat(summaryValues.subTotal)}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>IVA: ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.fotmat(summaryValues.tax)}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant='subtitle1'>Total: </Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
                <Typography variant='subtitle1' >{currency.fotmat(summaryValues.total)}</Typography>
            </Grid>
        </Grid>
    )
}
