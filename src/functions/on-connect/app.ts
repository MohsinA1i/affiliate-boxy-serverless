import AWS from 'aws-sdk'
import { APIGatewayProxyEvent } from 'aws-lambda'

const DynamoDB = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION })

export const lambdaHandler = async (event: APIGatewayProxyEvent) => {
    try {
        const userID = event.requestContext.authorizer!.userID
        const putParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
            TableName: process.env.TABLE_NAME!,
            Item: { 
                PK: `CONNECTION#${event.requestContext.connectionId}`,
                SK: `USER#${userID}`
            }
        }
        await DynamoDB.put(putParams).promise()
    } catch (error) {
        return { statusCode: 500, body: error.message }
    }
    return { statusCode: 200, body: 'Connected' }
}