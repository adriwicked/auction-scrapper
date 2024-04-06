# Auction Scrapper

![Auction Scrapper Diagram](/diagram/auction-scrapper-diagram.png)

## Description

This project is a scraper that extracts information about public auctions from the BOE auction portal.

It's deployed to a lambda function that stores the auctions in a DynamoDB table.

## Deployment

1. `npm run build`
2. Go to AWS Console > Lambda > auctionScrapper > Code > Upload from > .zip file
