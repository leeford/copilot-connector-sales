import { ISalesOrderItem } from "./ISalesOrderItem";

export interface ISalesOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    orderTotal: number;
    orderDate: string;
    orderItems: ISalesOrderItem[];
    _ts?: number;
}
