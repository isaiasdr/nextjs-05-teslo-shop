import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { DashboardSummaryResponse } from '../../../interfaces';
import { Order, Product, User } from '../../../models';

type Data = 
| { message: string }
| DashboardSummaryResponse

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getDataDashboard( req, res );
    
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

const getDataDashboard = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    await db.connect();
    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory

     ] = await Promise.all([
        Order.count(),
        Order.find({ isPaid: true }).count(),
        User.find({ role: 'client' }).count(),
        Product.count(),
        Product.find({ inStock: 0 }).count(),
        Product.find({ inStock: { $lte: 10 } }).count()
    ]);

    return res.status(200).json({
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        noPaidOrders: numberOfOrders - paidOrders,
    });
};