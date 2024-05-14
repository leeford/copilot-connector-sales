import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Graph } from "../modules/graph";
import { config } from "../config/config";

export async function getConnection(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const graph = new Graph(context);
        const existingConnection = await graph.getExternalConnection(config.externalConnection.id);
        if (existingConnection) {
            const quota = await graph.getExternalConnectionQuota(config.externalConnection.id)
                .catch((error) => {
                    console.warn(error);
                    return undefined;
                });
            const schema = await graph.getSchema(config.externalConnection.id)
                .catch((error) => {
                    console.warn(error);
                    return undefined;
                });
            return {
                status: 200,
                jsonBody: {
                    connection: existingConnection,
                    quota,
                    schema
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

    } catch (error) {
        return {
            status: 500,
            jsonBody: {
                message: "An error occurred while getting the external connection.",
                error: error
            }
        };
    }
}

app.http('getConnection', {
    route: 'connection',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getConnection
});
