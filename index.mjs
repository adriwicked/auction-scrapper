import { DeleteTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "auction";

export const handler = async (event) => {
  await removeAllAuctions();

  const auctions = getAuctions();

  auctions.forEach(async (auction) => await addAuction(auction));

  return;
};

async function removeAllAuctions() {
  const command = new DeleteTableCommand({ TableName: TABLE_NAME });
  return await client.send(command);
}

function getAuctions() {
  return [
    {
      id: "SUB-AT-2024-23R0886001470",
      appraisal: 90607.17,
      bidSpans: 1000,
      deposit: 2998.76,
      type: "agencia tributaria",
      value: 59975.22,
    },
  ];
}

async function addAuction(auctionInfo) {
  const id = `${auctionInfo.id}-${new Date().getTime()}`;
  const auction = Object.assign({}, auctionInfo, { id });
  const command = new PutCommand({ TableName: TABLE_NAME, Item: auction });
  return await docClient.send(command);
}
