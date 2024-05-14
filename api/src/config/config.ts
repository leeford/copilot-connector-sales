import { ExternalConnectors } from "@microsoft/microsoft-graph-types";

interface IConfig {
    externalConnection: ExternalConnectors.ExternalConnection;
    schema: ExternalConnectors.Schema;
}

export const config: IConfig = {
    externalConnection: {
        id: process.env.CONNECTION_ID as string,
        name: "Sales Orders",
        description: "Information about sales orders sold by us",
    },
    schema: {
        baseType: "microsoft.graph.externalItem",
        properties: [
            {
                name: "title",
                type: "string",
                isQueryable: true,
                isSearchable: true,
                isRetrievable: true,
                labels: ["title"]
            },
            {
                name: "url",
                type: "string",
                isQueryable: true,
                isSearchable: true,
                isRetrievable: true,
                labels: ["url"]
            },
            {
                name: "orderNumber",
                type: "string",
                isQueryable: true,
                isSearchable: true,
                isRetrievable: true,
                aliases: [
                    "orderNo",
                    "orderID",
                    "order"
                ]
            },
            {
                name: "customerName",
                type: "string",
                isQueryable: true,
                isSearchable: true,
                isRetrievable: true,
                aliases: [
                    "customer",
                    "name"
                ]
            },
            {
                name: "orderTotal",
                type: "double",
                isQueryable: true,
                isRetrievable: true,
                aliases: [
                    "total",
                    "amount",
                    "cost",
                    "price",
                    "spent"
                ]
            },
            {
                name: "orderDate",
                type: "dateTime",
                isQueryable: true,
                isRetrievable: true,
                labels: ["createdDateTime"]
            },
            {
                name: "lastModifiedDateTime",
                type: "dateTime",
                isQueryable: true,
                isRetrievable: true,
                labels: ["lastModifiedDateTime"]
            },
            {
                name: "orderItems",
                type: "stringCollection",
                isQueryable: true,
                isSearchable: true,
                isRetrievable: true
            }
        ]
    }
}