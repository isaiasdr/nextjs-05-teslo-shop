import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database';
import { Product, User } from '../../models';

type Data = {
    message: string
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    if( process.env.NODE_ENV !== 'development' )
        return res.status(400).json({ message: 'Metodo solo permitido durante desarrollo' });

    switch (req.method) {
        case 'GET':
            return runSeeder( req, res );
    
        default:
            return res.status(400).json({ message: 'Metodo no permitido' });
    };
};

const runSeeder = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    try {
        await db.connect(); 
        await User.deleteMany();
        await User.insertMany( seedDatabase.initialData.users );

        await Product.deleteMany();
        await Product.insertMany( seedDatabase.initialData.products );
        await db.disconnect();
        return res.status(201).json({ message: 'data importada' });

    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(500).json({ message: 'algo ha fallado' });
    }
};
