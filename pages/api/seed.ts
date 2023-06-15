/*TODO: Este archivo no es para subir a PROD ya que es solo para crear los datos de DB*/

import { db, seedDatabase } from '@component/database';
import { Order, Product, User } from '@component/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({ message: 'No tiene acceso a este servicio' });
    }

    await db.connect();

    await User.deleteMany();
    await User.insertMany(seedDatabase.initialData.users);

    await Product.deleteMany();
    await Product.insertMany(seedDatabase.initialData.products);

    await Order.deleteMany();

    await db.disconnect();

    res.status(200).json({ message: 'Proceso ok' });
}