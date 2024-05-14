import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Graph } from "../modules/graph";

export async function getConnections(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const graph = new Graph(context);
    const existingConnections = await graph.getExternalConnections();
    return {
        status: 200,
        jsonBody: {
            connections: existingConnections.value
        }
    };
};

app.http('getConnections', {
    route: 'connections',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getConnections
});
