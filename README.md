# NFTLogs

NFTLogs is a web application that allows you to track NFT trades and prices. It is built using Fastify and MongoDB, and uses the Ethers library to interact with Ethereum smart contracts.

## Installation

To use NFTLogs, you need to have Node.js and Docker installed on your machine. Then, you can follow these steps:

1. Clone the repository: `git clone https://github.com/<username>/NFTLogs.git`
2. Install dependencies: `cd NFTLogs && yarn install`
3. Build the TypeScript files: `yarn build`
4. Start a MongoDB container: `yarn start:db`
5. Start the application: `yarn start:app`

You can stop the application and the database container by running `yarn stop`.

## Usage

Once the application is running, you can access it at `http://localhost:3000/`. You can use the UI to search for NFTs and see their trade history and price trends.

## For Developers

If you are a developer and want to use watchers to automatically rebuild the TypeScript files when you make changes to them, you can use the following commands:

- `yarn build:watch`: Builds the TypeScript files and watches for changes
- `yarn dev`: Starts the application and restarts it when you make changes to the code

## Contributing

Contributions are welcome! If you find a bug or want to add a new feature, please create an issue or submit a pull request.

## License

NFTLogs is licensed under the MIT License. 
