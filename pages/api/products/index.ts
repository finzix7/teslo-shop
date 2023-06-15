import { db, SHOP_CONSTANTS } from '@component/database'
import { IProduct } from '@component/interfaces'
import { Product } from '@component/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data =
    | { message: string }
    | IProduct[]


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res)

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { gender = 'all' } = req.query;

    let condition = {};

    //Validamos que la entrada sea valido para el filtro, sino retornamos todos
    if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
        condition = { gender };
    }

    await db.connect();

    // filtramos por estos campos title images pricer inStock slug el (-_id) lo resta
    const products = await Product
        .find(condition)
        .select('title images price inStock slug -_id')
        .lean();

    await db.disconnect();

    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
        });

        return product;
    });

    return res.status(200).json(updatedProducts);
}
