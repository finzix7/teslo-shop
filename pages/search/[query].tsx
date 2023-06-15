import { ShopLayout } from '@component/components/layouts';
import { ProductList } from '@component/components/products';
import { dbProducts } from '@component/database';
import { IProduct } from '@component/interfaces';
import { Box, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';

interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}

export const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

    return (
        <ShopLayout title={'Teslo-Shop'} pageDescription={'Encuentra los mejores productos en TesloShop'}>
            <Typography variant='h1' component='h1'>Buscar producto</Typography>

            {
                foundProducts
                    ? <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>Término: {query}</Typography>
                    : (
                        <Box display='flex'>
                            <Typography variant='h2' sx={{ mb: 1 }}>No hemos encontrado ningún producto para: </Typography>
                            <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize' >{query}</Typography>
                        </Box>
                    )
            }


            <ProductList products={products} />
        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { query = '' } = params as { query: string };

    if (query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: true,
            }
        }
    }

    let products = await dbProducts.getProductByTerm(query);

    const foundProducts = products.length > 0;
    if (!foundProducts) {
        products = await dbProducts.getAllProducts();
    }

    return {
        props: {
            products,
            foundProducts,
            query,
        }
    }
}

export default SearchPage;