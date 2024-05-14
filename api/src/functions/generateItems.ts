import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";
import { ISalesOrderItem } from "../types/ISalesOrderItem";
import { ISalesOrder } from "../types/ISalesOrder";

const cosmosOutput = output.cosmosDB({
    databaseName: "sales",
    containerName: "orders",
    connection: "COSMOS_DB_CONNECTION",
    createIfNotExists: true,
    partitionKey: "/id"
});

export async function generateItems(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    const products = [
        "Chai",
        "Coffee beans",
        "Green tea",
        "Black tea",
        "Earl Grey tea",
        "Oolong tea",
        "Matcha",
        "Milk",
        "Sugar",
        "Honey",
        "Cinnamon",
        "Vanilla syrup",
        "Caramel syrup",
        "Hazelnut syrup",
        "Almond milk",
        "Coconut milk",
        "Soy milk",
        "Oat milk",
        "Whipped cream"
    ]

    const customers = [
        "John Doe",
        "Jane Doe",
        "Alice Smith",
        "Bob Smith",
        "Charlie Brown",
        "Lucy Brown",
        "Linus Brown",
        "Eva Johnson",
        "Michael Smith",
        "Olivia Brown",
        "William Davis",
        "Sophia Wilson",
        "James Anderson",
        "Emily Martinez",
        "Benjamin Taylor",
        "Isabella Thomas",
        "Alexander Garcia",
        "Mia Martinez",
        "Ethan Johnson"
    ]

    function getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomPrice(): number {
        return parseFloat((Math.random() * 10 + 1).toFixed(2));
    }

    function getRandomDate(): string {
        const previousDate = new Date();
        // Days ago
        previousDate.setDate(previousDate.getDate() - 90);
        const randomDate = new Date(previousDate.getTime() + Math.random() * (new Date().getTime() - previousDate.getTime()));
        return randomDate.toISOString();
    }

    function generateOrderItems(numItems: number, products: string[]): ISalesOrderItem[] {
        const shuffledProducts = products.sort(() => 0.5 - Math.random());
        return Array.from({ length: numItems }, (_, x) => {
            const quantity = getRandomNumber(1, 10);
            const price = getRandomPrice();
            return {
                productName: shuffledProducts[x],
                quantity,
                price,
                total: parseFloat((quantity * price).toFixed(2))
            };
        });
    }

    const orders: ISalesOrder[] = Array.from({ length: 20 }, () => {
        const orderNumber = getRandomNumber(10000, 20000).toString();
        const numItems = getRandomNumber(1, 6);
        const orderItems = generateOrderItems(numItems, products);
        const orderTotal = parseFloat(orderItems.reduce((sum, item) => sum + item.total, 0).toFixed(2));
        return {
            orderNumber,
            customerName: customers[getRandomNumber(0, customers.length - 1)],
            orderTotal,
            orderDate: getRandomDate(),
            orderItems,
            id: orderNumber
        };
    });

    context.extraOutputs.set(cosmosOutput, orders);

    return {
        status: 200,
        jsonBody: orders
    };

};

app.http('generateItems', {
    route: 'items/generate',
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [cosmosOutput],
    handler: generateItems
});
