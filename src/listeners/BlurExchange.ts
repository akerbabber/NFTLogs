import "dotenv/config";
import fp from "fastify-plugin";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { BytesLike, ethers } from "ethers";
import BlurExchangeABI from "@contractsAbi/BlurExchange.json";
import BlurProxyAbi from "@contractsAbi/ProxyBlurExchange.json";
import { BlurExchange } from "@contractsTypes/BlurExchange";
import { OrderStruct } from "../../types/ethers-contracts/BlurExchange";
import mongodb from '@fastify/mongodb';


const BlurExchangePlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  
  const BlurExchangeAddress: string = process.env
    .BLUR_EXCHANGE_MAINNET_ADDRESS as string;
  const BlurProxyAddress: string = process.env
    .BLUR_PROXY_MAINNET_ADDRESS as string;
  const rpcProvider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_PROVIDER as string
  );
  const BlurExchange = new ethers.Contract(
    BlurExchangeAddress,
    BlurExchangeABI,
    rpcProvider
  ) as BlurExchange;
  const BlurProxy = new ethers.Contract(
    BlurProxyAddress,
    BlurExchangeABI,
    rpcProvider
  ) as BlurExchange;
  const startBlockNumber = await rpcProvider.getBlockNumber();
  await server.log.info(
    `TXs LISTENER STARTED AT BLOCK: ${startBlockNumber} ON ADDRESS: ${BlurExchangeAddress}`
  );
 
  BlurProxy.on(
    "OrdersMatched",
    async (
      maker: string,
      taker: string,
      sell: OrderStruct,
      sellHash: BytesLike,
      buy: OrderStruct,
      buyHash: BytesLike,
      event: ethers.Event
    ) => {
      if (event.blockNumber <= startBlockNumber) return;
      const db = server.mongo?.db;
      if (!db) {
        server.log.error("Failed to access MongoDB database");
        return;
      }
      const ordersCollection = db.collection("orders");
      try {
        await ordersCollection.insertOne({
          maker,
          taker,
          sell,
          sellHash,
          buy,
          buyHash,
          eventBlockNumber: event.blockNumber,
        });
        server.log.info(`Inserted matched orders into MongoDB database`);
      } catch (error) {
        server.log.error(`Failed to insert orders into MongoDB database: ${error}`);
      }
    }
  );

};



export default fp(BlurExchangePlugin);
