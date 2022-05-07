import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models';

type Data = 
| { message: string }
| IProduct

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProductBySlug( req, res );
    
        default:
            return res.status(400).json({ message: 'Metodo no permitido' });
    }
}

const getProductBySlug = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { slug } = req.query;

    try {
        await db.connect();

        const product = await Product.findOne({ slug }).lean();

        await db.disconnect();

        if( product ) {
            product.images = product.images.map( image => {
                return image.includes('https') ? image : `${ process.env.HOST_NAME }products/${ image }`
            });

            return res.status(200).json( product );
        }

        return res.status(404).json({ message: 'Product not Found' });

    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(500).json({ message: 'Error' });
    }
};