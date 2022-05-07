import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

cloudinary.config( process.env.CLOUDINARY_URL || '' );

type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProducts( req, res );

        case 'POST':
            return createProduct( req, res );

        case 'PUT':
            return updateProduct( req, res );
            
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    const products = await Product.find().sort({ title: 'asc' }).lean();
    await db.disconnect();

    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('https') ? image : `${ process.env.HOST_NAME }products/${ image }`
        });

        return product;
    });

    return res.status(200).json( updatedProducts );
}

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { images = [] } = req.body as IProduct;

    if ( images.length < 2 )
        return res.status(400).json({ message: 'Es necesario al menos 2 imagenes' });

    try {
        await db.connect();

        const productDB = await Product.findOne({ slug: req.body.slug });
        if ( productDB ) {
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe un producto con el slug' });
        }

        const product = new Product( req.body );
        await product.save();
        await db.disconnect();

        return res.status(201).json( product );

    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ message: 'revisar servidor' });
    }
}

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '', images = [] } = req.body as IProduct;

    if( !isValidObjectId( _id ) )
        return res.status(400).json({ message: 'El id del producto no es valido' });

    if ( images.length < 2 )
        return res.status(400).json({ message: 'Es necesario al menos 2 imagenes' });

    try {
        await db.connect();
        const product = await Product.findById( _id );

        if ( !product ) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe un producto con el id' });
        }

        product.images.forEach( async(image) => {
            if ( !images.includes(image) ) {
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') +1 ).split('.');

                await cloudinary.uploader.destroy( fileId );
            }
        })

        await Product.updateOne({ _id }, req.body);
        await db.disconnect();

        return res.status(200).json( product );

    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'revisar servidor' });
    }
}