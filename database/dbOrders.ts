import { isValidObjectId } from 'mongoose';

import { IOrder } from "../interfaces";
import { Order } from "../models";
import { db } from "./";


export const getOrderbyId = async ( _id: string ): Promise<IOrder | null> => {
    
    if( !isValidObjectId(_id) )
        return null;

    await db.connect();
    const order = await Order.findById( _id ).lean();
    await db.disconnect();

    if( !order )
        return null 

    else
        return JSON.parse(JSON.stringify(order));
};

export const getOrdersByUser = async ( user: string ) : Promise<IOrder[]> => {
    if( !isValidObjectId(user) )
        return [];

    await db.connect();
    const orders = await Order.find({ user }).lean();
    await db.disconnect();
    
    if( !orders )
        return [];
    
    else
        return orders.map( order => JSON.parse(JSON.stringify( order )) );
};