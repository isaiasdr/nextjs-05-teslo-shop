import { db } from "./"
import { Product } from "../models";
import { IProduct } from '../interfaces';


export const getProductBySlug = async ( slug: string ): Promise<IProduct | null> => {

    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();

    if( !product )
        return null;
    else
        return JSON.parse(JSON.stringify(product));
}

interface ProductSlug {
    slug: string;
}

export const getAllProductsSlug = async(): Promise<ProductSlug[]> => {
    await db.connect();
    const slugs = await Product.find().select('slug -_id');
    await db.disconnect();

    return slugs;
}

export const getProductByTerm = async (term: string): Promise<IProduct[]>  => {

    await db.connect();
    const products = await Product.find({
        $text: { $search: term }
    })
    .select(' title images price inStock slug -_id ')
    .lean();

    await db.disconnect();

    return products;
}

export const getAllProducts = async (): Promise<IProduct[]>  => {

    await db.connect();
    const products = await Product.find()
    .select(' title images price inStock slug -_id ')
    .lean();

    await db.disconnect();

    return products;
}