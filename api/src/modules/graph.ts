import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { ClientSecretCredential } from "@azure/identity";
import { ExternalConnectors } from "@microsoft/microsoft-graph-types";
import { InvocationContext } from "@azure/functions"

export class Graph {

    private context: InvocationContext;
    public client: Client;

    constructor(context: InvocationContext) {
        try {
            this.context = context;
            const credential = new ClientSecretCredential(
                process.env.MicrosoftAppTenantId as string,
                process.env.MicrosoftAppId as string,
                process.env.MicrosoftAppPassword as string
            );
            // Auth provider
            const authProvider = new TokenCredentialAuthenticationProvider(credential, {
                scopes: ['https://graph.microsoft.com/.default'],
            });
            const clientOptions: ClientOptions = {
                defaultVersion: "beta",
                debugLogging: false,
                authProvider
            };
            const client = Client.initWithMiddleware(clientOptions);
            this.client = client;
        } catch (error) {
            throw error;
        }
    }

    public async createExternalConnection(externalConnection: ExternalConnectors.ExternalConnection): Promise<void> {
        try {
            await this.client.api('/external/connections')
                .post(externalConnection);
        } catch (error) {
            throw error;
        }
    }

    public async getExternalConnections(): Promise<any> {
        try {
            const result = await this.client.api(`/external/connections`)
                .get();
            return result;
        } catch (error) {
            throw error;
        }
    }

    public async getExternalConnection(connectionId: string): Promise<ExternalConnectors.ExternalConnection | undefined> {
        try {
            const result = await this.client.api(`/external/connections/${connectionId}`)
                .get();
            return result;
        } catch (error) {
            if (error.statusCode === 404) {
                return undefined;
            } else {
                throw error;
            }
        }
    }

    public async deleteExternalConnection(connectionId: string): Promise<void> {
        try {
            await this.client.api(`/external/connections/${connectionId}`)
                .delete();
        } catch (error) {
            throw error;
        }
    }

    public async getExternalConnectionQuota(connectionId): Promise<any> {
        try {
            const result = await this.client.api(`/external/connections/${connectionId}/quota`)
                .get();
            return result;
        } catch (error) {
            throw error;
        }
    }

    public async getSchema(connectionId: string): Promise<ExternalConnectors.Schema | undefined> {
        try {
            const result = await this.client.api(`/external/connections/${connectionId}/schema`)
                .get();
            return result;
        } catch (error) {
            if (error.statusCode === 404) {
                return undefined;
            } else {
                throw error;
            }
        }
    }

    public async createSchema(connectionId: string, schema: ExternalConnectors.Schema): Promise<void> {
        try {
            await this.client.api(`/external/connections/${connectionId}/schema`)
                .update(schema);
        } catch (error) {
            throw error;
        }
    }

    public async createExternalItem(connectionId: string, externalItem: ExternalConnectors.ExternalItem): Promise<void> {
        try {
            await this.client.api(`/external/connections/${connectionId}/items/${externalItem.id}`)
                .put(externalItem);
        } catch (error) {
            throw error;
        }
    }

}