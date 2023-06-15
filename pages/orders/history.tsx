import { ShopLayout } from "@component/components/layouts";
import { dbOrders } from "@component/database";
import { IOrder } from "@component/interfaces";
import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from "next-auth/react";
import NextLink from "next/link";
import { ReactNode } from "react";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },

    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si orden está pagada o no',
        width: 200,
        renderCell: (params: GridCellParams): ReactNode => {
            return params.row.paid
                ? <Chip color="success" label="Pagada" variant="outlined" />
                : <Chip color="error" label="Pendiente" variant="outlined" />

        }
    },

    {
        field: 'orden',
        headerName: 'Ver orden',
        description: 'Link para el producto',
        width: 200,
        renderCell: (params: GridCellParams): ReactNode => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
                    <Link underline="always">
                        Ir a la orden
                    </Link>
                </NextLink>
            )
        }
    }
]


interface Props {
    orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

    const rows = orders.map((order, idx) => ({
        id: idx + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }))

    return (
        <ShopLayout title="Historial de ordenes" pageDescription={"Historial de ordenes del cliente"}>
            <Typography variant="h1" component="h1" >Historial de ordenes</Typography>

            <Grid container className="fadeIn">
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[25]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 25,
                                },
                            },
                        }}
                    />

                </Grid>
            </Grid>

        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?page=orders/history',
                permanent: false,
            }
        }
    }

    const orders = await dbOrders.getOrderByUser(session.user._id);

    return {
        props: {
            orders,
        }
    }
}

export default HistoryPage