import React, { useEffect, useState } from 'react';
import { DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, Subtitle1, Subtitle2, TableCellLayout, TableColumnDefinition, Text, createTableColumn, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { useParams } from "react-router";
import { ISalesOrder } from "../types/ISalesOrder";
import { ISalesOrderItem } from "../types/ISalesOrderItem";

interface IOrderProps {
}

const orderStyles = makeStyles({
    order: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.padding(tokens.spacingHorizontalM, tokens.spacingVerticalM),
        ...shorthands.gap(tokens.spacingHorizontalM)
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.padding(tokens.spacingHorizontalM, tokens.spacingVerticalM),
        backgroundColor: tokens.colorNeutralBackground3,
        ...shorthands.borderRadius(tokens.borderRadiusLarge)
    }
});

const orderItemColumns: TableColumnDefinition<ISalesOrderItem>[] = [
    createTableColumn<ISalesOrderItem>({
        columnId: "productName",
        renderHeaderCell: () => {
            return "Product";
        },
        renderCell: (item) => {
            return (
                <TableCellLayout>
                    {item.productName}
                </TableCellLayout>
            );
        }
    }),
    createTableColumn<ISalesOrderItem>({
        columnId: "quantity",
        renderHeaderCell: () => {
            return "Quantity";
        },
        renderCell: (item) => {
            return (
                <TableCellLayout>
                    {item.quantity}
                </TableCellLayout>
            );
        }
    }),
    createTableColumn<ISalesOrderItem>({
        columnId: "price",
        renderHeaderCell: () => {
            return "Price";
        },
        renderCell: (item) => {
            return (
                <TableCellLayout>
                    ${item.price}
                </TableCellLayout>
            );
        }
    }),
    createTableColumn<ISalesOrderItem>({
        columnId: "total",
        renderHeaderCell: () => {
            return "Total";
        },
        renderCell: (item) => {
            return (
                <TableCellLayout>
                    ${item.total}
                </TableCellLayout>
            );
        }
    })
];

export const Order: React.FunctionComponent<IOrderProps> = () => {

    const { id } = useParams();
    const [order, setOrder] = useState<ISalesOrder | undefined>(undefined);
    const classes = orderStyles();
    useEffect(() => {
        fetch(`/api/orders/${id}`)
            .then(response => response.json())
            .then(data => setOrder(data))
            .catch(error => console.error('Error:', error));
    }, [id]);

    return (
        <div>
            {order && order.id && (
                <div className={classes.order}>
                    <div className={classes.section}>
                        <Subtitle1>Order: {order.id}</Subtitle1>
                        <Text>Customer: {order.customerName}</Text>
                        <Text>Order date: {new Date(order.orderDate).toLocaleString()}</Text>
                        <Text>Order total: ${order.orderTotal}</Text>
                    </div>
                    <div className={classes.section}>
                        <Subtitle2>Items ordered:</Subtitle2>
                        <DataGrid
                            items={order.orderItems}
                            columns={orderItemColumns}
                        >
                            <DataGridHeader>
                                <DataGridRow
                                    selectionCell={undefined}
                                >
                                    {({ renderHeaderCell }) => (
                                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                                    )}
                                </DataGridRow>
                            </DataGridHeader>
                            <DataGridBody<unknown>>
                                {({ item, rowId }) => (
                                    <DataGridRow<unknown>
                                        key={rowId}
                                        selectionCell={undefined}
                                    >
                                        {({ renderCell }) => (
                                            <DataGridCell>{renderCell(item)}</DataGridCell>
                                        )}
                                    </DataGridRow>
                                )}
                            </DataGridBody>
                        </DataGrid>
                    </div>
                </div>
            )}
        </div>
    );
};
