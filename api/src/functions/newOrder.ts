import { app, InvocationContext } from "@azure/functions";
import { Graph } from "../modules/graph";
import { ExternalConnectors } from "@microsoft/microsoft-graph-types";
import { ISalesOrder } from "../types/ISalesOrder";
import { config } from "../config/config";

export async function newOrder(documents: ISalesOrder[], context: InvocationContext): Promise<void> {
    if (documents.length > 0) {
        const graph = new Graph(context);
        // Loop through each document
        for (const document of documents) {
            try {
                context.log(`Processing document: ${JSON.stringify(document)}`);
                // Create external item
                const externalItem: ExternalConnectors.ExternalItem = {
                    id: document.id,
                    acl: [
                        {
                            accessType: "grant",
                            type: "everyone",
                            value: "everyone"
                        }
                    ],
                    properties: {
                        title: `Order No: ${document.orderNumber}`,
                        url: `https://${process.env.BASE_URL}/orders/${document.orderNumber}`,
                        orderNumber: document.orderNumber,
                        customerName: document.customerName,
                        orderTotal: document.orderTotal,
                        orderDate: document.orderDate,
                        // Calculate the last modified date by converting the _ts property (unix epoch) to a Date object
                        lastModifiedDateTime: new Date(document._ts * 1000).toISOString(),
                        // Add the order items as a string summary
                        "orderItems@odata.type": "Collection(String)",
                        orderItems: document.orderItems.map(item => `${item.productName} x ${item.quantity} @ $${item.price} = $${item.total}`)
                    },
                    content: {
                        type: "text",
                        value: `Order No: ${document.orderNumber}\nCustomer: ${document.customerName}\nTotal: $${document.orderTotal}\nDate: ${document.orderDate}\nItems:\n${document.orderItems.map(item => `${item.productName} x ${item.quantity} @ $${item.price} = $${item.total}`).join('\n')}`
                    }
                };
                await graph.createExternalItem(config.externalConnection.id, externalItem);
                context.log(`External item created for document: ${JSON.stringify(document)}`);
            } catch (error) {
                context.log(`Error processing document: ${JSON.stringify(document)}`);
                context.log(error);
            }
        };
    }

    context.log(`Cosmos DB function processed ${documents.length} documents`);
}

app.cosmosDB('newOrder', {
    connection: 'COSMOS_DB_CONNECTION',
    databaseName: 'sales',
    containerName: 'orders',
    createLeaseCollectionIfNotExists: true,
    handler: newOrder
});
