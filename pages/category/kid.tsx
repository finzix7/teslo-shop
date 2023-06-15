import { ShopLayout } from '@component/components/layouts';
import { ProductList } from '@component/components/products';
import { FullScreenLoading } from '@component/components/ui';
import { useProducts } from '@component/hooks';
import { Typography } from '@mui/material';

export default function KidPage() {

  const { products, isLoading, } = useProducts('/products?gender=kid');

  return (
    <ShopLayout title={'Teslo-Shop - Niños'} pageDescription={'Encuentra los mejores productos en TesloShop para niños'}>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos para niños</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }


    </ShopLayout>
  )
}
