import { ShopLayout } from '@component/components/layouts';
import { ProductList } from '@component/components/products';
import { FullScreenLoading } from '@component/components/ui';
import { Typography } from '@mui/material';
import { useProducts } from '../hooks/useProducts';

export default function HomePage() {

  const { products, isLoading, } = useProducts('/products');

  return (
    <ShopLayout title={'Teslo-Shop'} pageDescription={'Encuentra los mejores productos en TesloShop'}>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }


    </ShopLayout>
  )
}
