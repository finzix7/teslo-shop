import { AdminLayout } from "@component/components/layouts";
import { IProduct } from "@component/interfaces";
import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import useSWR from 'swr';
import NextLink from 'next/link';

const columns: GridColDef[] = [
    {
        field: 'img',
        headerName: 'Foto',
        renderCell: ({ row }: GridCellParams) => {
            return (
                <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
                    <CardMedia
                        title={`${row.title}`}
                        component='img'
                        className="fadeIn"
                        image={row.img}
                    />
                </a>
            )
        }
    },
    {
        field: 'title',
        headerName: 'Titulo',
        width: 250,
        renderCell: ({ row }: GridCellParams) => {
            return (
                <NextLink href={`/admin/products/${row.slug}`} passHref legacyBehavior >
                    <Link underline="always">
                        {row.title}
                    </Link>
                </NextLink>
            )
        }
    },
    { field: 'gender', headerName: 'Género' },
    { field: 'type', headerName: 'Tipo' },
    { field: 'inStock', headerName: 'En stock' },
    { field: 'price', headerName: 'Precio' },
    { field: 'sizes', headerName: 'Tallas', width: 250 },

];

const ProductsPage = () => {

    const { data, error } = useSWR<IProduct[]>('/api/admin/products');

    if (!data && !error) return (<></>);

    const rows = data!.map(product => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug,
    }));

    return (
        <AdminLayout
            title={`Productos (${data?.length})`}
            subTitle={'Mantenimiento de productos'}
            icon={<CategoryOutlined />}
        >

            <Box display='flex' justifyContent='end' sx={{ smb: 2, mb: 1 }}>
                <Button
                    startIcon={<AddOutlined />}
                    color="secondary"
                    href="/admin/products/new"
                >
                    Crear producto
                </Button>
            </Box>

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

export default ProductsPage;