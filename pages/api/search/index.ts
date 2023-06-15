import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.status(404).json({ message: 'Debe especificar un critertio de busqueda' })
}