import { IProduct } from "@component/interfaces";
import { Grid } from "@mui/material";
import { FC } from "react";
import { ProductCard } from ".";

interface Props {
    products: IProduct[];
}

export const ProductList: FC<Props> = ({ products }) => {
    return (
        <Grid container spacing={4} item={true}>
            {
                products.map((product, zIndex) => (
                    <ProductCard
                        index={zIndex}
                        key={product.slug}
                        product={product}
                    />
                ))
            }
        </Grid>
    )
}
