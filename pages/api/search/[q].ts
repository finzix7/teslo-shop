import { db } from '@component/database';
import { IProduct } from '@component/interfaces';
import { Product } from '@component/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data =
    | { message: string }
    | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return searchProducts(req, res);

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }

}

const searchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    let { q = '' } = req.query;

    if (q.length === 0) {
        return res.status(400).json({
            message: 'Debe especificar un critertio de busqueda'
        })
    }

    q = q.toString().toLowerCase();

    await db.connect();

    //realizamos la busqueda por texto
    const products = await Product.find({
        $text: { $search: q }
    })
        .select('tile images price inStock slug -_id')
        .lean();


    await db.disconnect();

    return res.status(200).json(products);
}