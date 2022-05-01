export interface DashboardSummaryResponse {
    numberOfOrders: number;
    paidOrders: number;
    noPaidOrders: number;
    numberOfClients: number; 
    numberOfProducts: number;
    productsWithNoInventory: number;
    lowInventory: number;
};