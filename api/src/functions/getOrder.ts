import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from "@azure/functions";

const cosmosInput = input.cosmosDB({
    databaseName: "sales",
    containerName: "orders",
    connection: "COSMOS_DB_CONNECTION",
    partitionKey: "{id}",
    id: "{id}"
});

export async function getOrder(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const data = context.extraInputs.get(cosmosInput);
        if (data) {
            return {
                status: 200,
                jsonBody: data
            };
        } else {
            return {
                status: 404,
                jsonBody: {
                    message: "Order not found"
                }
            };
        }

    } catch (error) {
        return {
            status: 500,
            jsonBody: {
                message: "An error occurred while getting the order.",
                error: error
            }
        };
    }
}

app.http('getOrder', {
    route: 'orders/{id}',
    methods: ['GET'],
    extraInputs: [cosmosInput],
    authLevel: 'anonymous',
    handler: getOrder
});
