import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Graph } from "../modules/graph";
import { config } from "../config/config";

export async function deleteConnection(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    const graph = new Graph(context);
    const existingConnection = await graph.getExternalConnection(config.externalConnection.id);
    if (existingConnection) {
        await graph.deleteExternalConnection(config.externalConnection.id);
        return {
            status: 200,
            jsonBody: {
                message: `The external connection '${config.externalConnection.id}' has been deleted.`
            }
        };
    } else {
        return {
            status: 404,
            jsonBody: {
                message: "Connection not found"
            }
        };
    }
};

app.http('deleteConnection', {
    route: 'connection',
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: deleteConnection
});
