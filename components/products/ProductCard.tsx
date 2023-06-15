import { IProduct } from "@component/interfaces";
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { FC, useMemo, useState } from "react";

interface Props {
    product: IProduct;
    index: number;
}
export const ProductCard: FC<Props> = ({ product, index }) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isImageLoader, setImageLoader] = useState(false);

    const productImage = useMemo(() => {
        return isHovered
            ? product.images[1]
            : product.images[0]
    }, [isHovered, product.images])

    return (

        <Grid
            item
            xs={6}
            sm={4}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card>
                <NextLink href={`/product/${product.slug}`} passHref prefetch={false} legacyBehavior>
                    <Link>

                        <CardActionArea>

                            {
                                (product.inStock === 0) && (<Chip
                                    color="primary"
                                    label="No hay disponibles"
                                    sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
                                />)
                            }

                            <CardMedia
                                id={`imgProduct_${index.toString()}`}
                                component='img'
                                className='fadeIn'
                                image={productImage}
                                alt={product.title}
                                onLoad={() => setImageLoader(true)}
                            />

                        </CardActionArea>
                    </Link>

                </NextLink>

            </Card>


            <Box sx={{ mt: 1, display: isImageLoader ? 'block' : 'none' }} className='fadeIn'>
                <Typography fontWeight={700}>{product.title}</Typography>
                <Typography fontWeight={500}>{`$${product.price}`}</Typography>
            </Box>

        </Grid>
    )
}
