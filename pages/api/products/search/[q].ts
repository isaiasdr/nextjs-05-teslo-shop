import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../../database';
import { IProduct } from '../../../../interfaces';
import { Product } from '../../../../models';

type Data = 
| { message: string }
| IProduct[]

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return searchProducts( req, res );
    
        default:
            return res.status(400).json({ message: 'Metodo no permitido' });
    }
}

const searchProducts = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {
    
    let { q = '' } = req.query;

    if (q.length === 0) {
        return res.status(400).json({
            message: 'Debe establecer el parametro de busqueda'
        });
    }

    q = q.toString().toLowerCase();

    try {
        await db.connect();

        const products = await Product.find({ 
            $text: { $search: q }
        }).lean();

        await db.disconnect();

        if( products )
            return res.status(200).json( products );

        return res.status(404).json({ message: 'Product not Found' });


    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(500).json({ message: 'Error' });
    }




    return res.status(200).json({
        message: 'ok'
    });
};


