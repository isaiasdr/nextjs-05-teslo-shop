import type { NextApiRequest, NextApiResponse } from 'next';
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
            return loginUser( req, res );
            
        default:
            return res.status(400).json({
                message: 'Bad Request'
            });
    }
}

const loginUser = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { email = '', password = '' } = req.body as { email: string, password: string };

    await db.connect();
    const user = await User.findOne({ email }).lean();
    await db.disconnect();


    if ( !user )
        return res.status(400).json({
            message: 'Correo o contraseña no validos'
        });

    if( !bcrypt.compareSync(password, user.password! ) )
        return res.status(400).json({
            message: 'Correo o contraseña no validos'
        });

    const { _id, role, name } = user;

    const token = jwt.signToken( _id, email );

    return res.status(200).json({
        token,
        user: {
            role,
            name,
            email
        }
    });
}