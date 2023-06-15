import { AdminLayout } from "@component/components/layouts"
import { IOrder, IUser } from "@component/interfaces";
import { ConfirmationNumberOutlined } from "@mui/icons-material"
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import useSWR from 'swr';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre Completo', width: 300 },
    { field: 'total', headerName: 'Monto Total', width: 150 },
    {
        field: 'isPaid',
        headerName: 'Pagada',
        width: 150,
        renderCell: ({ row }: GridCellParams) => {
            return row.isPaid
                ? (<Chip variant="outlined" label="Pagada" color="success" />)
                : (<Chip variant="outlined" label="Pendiente" color="error" />)
        }
    },
    { field: 'nroProducts', headerName: 'Nro. de Productos', align: 'center', width: 150  },
    {
        field: 'check',
        headerName: 'Ver Orden',
        renderCell: ({ row }: GridCellParams) => {
            return (
                <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer" >
                    Ver Orden
                </a>
            )
        }
    },
    { field: 'createdAt', headerName: 'Creada en', width: 150  },

];

const OrdersPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

    if (!data && !error) return (<></>);

    const rows = data!.map(order => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        nroProducts: order.numberOfItems,
        createdAt: order.createdAt,
    }));

    return (
        <AdminLayout
            title={'Ordenes'}
            subTitle={'Mantenimiento de ordernes'}
            icon={<ConfirmationNumberOutlined />}
        >
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

        </AdminLayout>
    )
}

export default OrdersPage;