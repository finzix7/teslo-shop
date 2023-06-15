import { ShopLayout } from '@component/components/layouts';
import { ProductList } from '@component/components/products';
import { FullScreenLoading } from '@component/components/ui';
import { useProducts } from '@component/hooks';
import { Typography } from '@mui/material';

export default function MenPage() {

    const { products, isLoading, } = useProducts('/products?gender=men');

    return (
        <ShopLayout title={'Teslo-Shop - Hombres'} pageDescription={'Encuentra los mejores productos en TesloShop para hombres'}>
            <Typography variant='h1' component='h1'>Tienda</Typography>
            <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos para hombres</Typography>

            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }


        </ShopLayout>
    )
}
