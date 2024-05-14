import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Graph } from "../modules/graph";
import { config } from "../config/config";

export async function createConnection(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // Check if the external connection already exists
        const graph = new Graph(context);
        const existingConnection = await graph.getExternalConnection(config.externalConnection.id);
        if (!existingConnection) {
            // Create the external connection
            await graph.createExternalConnection(config.externalConnection);
        }

        // Get the schema
        // Compare it to the schema that is being created
        // If it is different, update the schema
        // If it is the same, return the existing schema
        const existingSchema = await graph.getSchema(config.externalConnection.id);
        if (existingSchema && JSON.stringify(existingSchema) === JSON.stringify(config.schema)) {
            return {
                status: 200,
                jsonBody: {
                    message: `The schema for the external connection '${config.externalConnection.id}' already exists.`,
                    schema: existingSchema,
                    connection: existingConnection
                }
            };
        } else {
            // Create the schema
            await graph.createSchema(config.externalConnection.id, config.schema);
            return {
                status: 202,
                jsonBody: {
                    message: "The schema is being created. Check back in 60 seconds to see if it is ready.",
                    schema: config.schema,
                    connection: existingConnection
                }
            };
        }
    } catch (error) {
        return {
            status: 500,
            jsonBody: {
                message: "An error occurred while creating the external connection.",
                error: error
            }
        };
    }
};

app.http('createConnection', {
    route: 'connection',
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: createConnection
});
