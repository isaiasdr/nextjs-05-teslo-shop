import type { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import { db } from '../../../database';
import { User } from '../../../models';
import { jwt } from '../../../utils';

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

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return registerUser( req, res );
            
        default:
            return res.status(400).json({
                message: 'Bad Request'
            });
    }
}

const registerUser = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };
    
    if ( password.length < Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH!) ) {
        return res.status(400).json({
            message: `la contraseña debe tener un minimo de ${Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH!)} caracteres`
        });
    }

    if ( !validator.isEmail( email ) ) {
        return res.status(400).json({
            message: 'El correo ingresado no es valido'
        });
    }

    if ( name.length < 2 ) {
        return res.status(400).json({
            message: 'debe ingresar un nombre de usuario'
        });
    }

    await db.connect();
    const user = await User.findOne({ email });
    
    if( user ) {
        await db.disconnect();
        return res.status(400).json({ message: 'Correo ya registrado' });
    }

    const newUser = new User({
        email: email.toLowerCase(),
        name: name.toLowerCase(),
        password: bcrypt.hashSync( password )
    });

    try {
        await newUser.save({ validateBeforeSave: true });
        await db.disconnect();
    } catch (error) {
        await db.disconnect();
        return res.status(500).json({
            message: 'Revisar logs del servidor'
        });
    }

    const { _id, role } = newUser;

    const token = jwt.signToken( _id, name );

    return res.status(201).json({
        token,
        user: {
            role,
            name,
            email
        }
    });
}