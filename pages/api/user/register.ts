import { db } from '@component/database';
import { User } from '@component/models';
import { jwt, validations } from '@component/utils';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data =
    | { message: string }
    | {
        token: string;
        user: {
            email: string;
            name: string;
            role: string;
        }
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return registerUser(req, res);

        default:
            res.status(400).json({
                message: 'Bad request'
            });
    }

}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };

    if (password.length < 6) {
        return res.status(400).json({
            message: 'La contraseña debe ser mayor a 6 caracteres'
        });
    }

    if (name.length < 2) {
        return res.status(400).json({
            message: 'El nombre debe terner un minimo de 2 caracteres'
        });
    }

    if (!validations.isValidEmail(email)) {
        return res.status(400).json({
            message: 'El correo ingresado no es válido'
        });
    }

    await db.connect();
    const user = await User.findOne({ email });

    if (user) {
        await db.disconnect();
        return res.status(400).json({
            message: 'No es posible registrar este usuario'
        });
    }

    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name,
    });

    try {
        await newUser.save({ validateBeforeSave: true });
        await db.disconnect();
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(500).json({
            message: 'Revisar logs de servidor'
        });
    }

    const { _id, role } = newUser;
    const token = jwt.signToken(_id, email);

    return res.status(200).json({
        token,
        user: {
            email,
            role,
            name
        }
    });
}
