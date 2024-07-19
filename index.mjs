import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "eu-west-3" });

const BUCKET_NAME = "auctions-bucket";

await updateAuctions();

async function updateAuctions() {
  const auctions = await getAuctions();

  await saveAuctions(auctions);
}

async function getAuctions() {
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

async function saveAuctions(auctions) {
  const auctionsJSON = JSON.stringify(auctions, null, 2);

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: "auctions.json",
      Body: auctionsJSON,
      ContentType: "application/json",
    });
    const response = await s3Client.send(command);
    console.log("Auctions saved in S3: ", response);
  } catch (err) {
    console.error("Error saving auctions in S3:", err);
  }
}
