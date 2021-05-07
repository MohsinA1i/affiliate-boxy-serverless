import AWS from 'aws-sdk'
import { APIGatewayEvent } from 'aws-lambda'

const DynamoDB = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION })

export const lambdaHandler = async (event: APIGatewayEvent) => {
    try {
        const userKey = await getUserKey(event.requestContext.connectionId!)
    } catch (error) {
        return { statusCode: 500, body: error.message }
    }
    return { statusCode: 200, body: 'Added' }
}

const getUserKey = async (connectionId: string) => {
    const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: process.env.TABLE_NAME!,
        KeyConditionExpression: 'PK = :PK',
        ExpressionAttributeValues: {
            ':PK': `CONNECTION#${connectionId}`
        },
        ProjectionExpression: 'SK'
    }
    const { Items } = await DynamoDB.query(queryParams).promise()
    if (Items) return Items[0].SK
}