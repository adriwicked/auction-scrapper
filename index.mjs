import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  // Obtener la primera subasta de próxima apertura
  const response = addAuction({
    id: "SUB-AT-2024-23R0886001470",
    appraisal: 90607.17,
    bidSpans: 1000,
    deposit: 2998.76,
    type: "agencia tributaria",
    value: 59975.22,
  });

  return response;
};

async function addAuction(auctionInfo) {
  const TABLE_NAME = "auction";
  const id = `${auctionInfo.id}-${new Date().getTime()}`;
  const auction = Object.assign({}, auctionInfo, { id });
  const command = new PutCommand({ TableName: TABLE_NAME, Item: auction });
  return await docClient.send(command);
}
