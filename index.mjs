import {
  DeleteTableCommand,
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-3" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "auction";
const WAIT_TIME = 10;

export async function handler(event) {
  await deleteTable();
  await wait(WAIT_TIME);

  await createTable();
  await waitTableExists();

  const auctions = getAuctions();
  const response = await addAuctions(auctions);
  console.log(response);
  return response;
}

async function deleteTable() {
  try {
    const command = new DeleteTableCommand({ TableName: TABLE_NAME });
    const response = await client.send(command);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function createTable() {
  const command = new CreateTableCommand({
    TableName: TABLE_NAME,
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  });

  const response = await client.send(command);
  console.log(response);
  return response;
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

async function addAuctions(auctions) {
  return Promise.all(auctions.map((auction) => addAuction(auction)));
}

async function addAuction(auctionInfo) {
  const id = `${auctionInfo.id}-${new Date().getTime()}`;
  const auction = Object.assign({}, auctionInfo, { id });
  const command = new PutCommand({ TableName: TABLE_NAME, Item: auction });
  const response = await docClient.send(command);
  console.log(response);
  return response;
}

async function waitTableExists() {
  let tableStatus;

  while (tableStatus !== "ACTIVE") {
    try {
      const command = new DescribeTableCommand({ TableName: TABLE_NAME });
      const response = await client.send(command);
      console.log("DescribeTableCommand response", response);
      tableStatus = response?.Table?.TableStatus;
    } catch (error) {
      console.error("Error describing table:", error);
    }
  }
}

async function wait(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}
