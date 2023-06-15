import { db } from '@component/database';
import { IOrder } from '@component/interfaces';
import { Order, Product } from '@component/models';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

type Data =
    | { message: string }
    | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return createRouteLoader(req, res);

        default:
            return res.status(400).json({ message: 'Bad Request' });
    }
}

const createRouteLoader = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { orderItems, total } = req.body as IOrder;

    //Verificar que tengamos usuario
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'Debe estar autenticado para continuar' });
    }

    //Crear arreglo con los productos que se quieren comprar
    const productsIds = orderItems.map(product => product._id);
    await db.connect();

    const dbProducts = await Product.find({ _id: { $in: productsIds } });

    try {

        //Se realiza este proceso para asegurar que los montos no han sido modificados por el cliente
        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find(prod => prod.id === current._id)?.price;

            if (!currentPrice) {
                throw new Error('Verifique el carrito otra vez, producto no existe');
            }

            return (current.price * current.quantity) + prev
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * (taxRate + 1);

        if (total !== backendTotal) {
            throw new Error('El total no es valido con el monto');
        }

        //Todo ok
        // @ts-ignore
        const userId = session.user._id
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        newOrder.total = Math.round(newOrder.total * 100) / 100;

        await newOrder.save();
        await db.disconnect();

        return res.status(201).json(newOrder);


    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({
            message: error.message || 'Debe estar autenticado para continuar'
        });
    }
}
