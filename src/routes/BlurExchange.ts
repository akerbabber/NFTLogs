import { FastifyPluginAsync } from 'fastify';
import { Collection } from 'mongodb';
import { Order } from '../models/order';

interface QueryParams {
  page: string;
  limit: string;
  sort_by: string;
  sort_dir: string;
}

const getAllOrdersRoute: FastifyPluginAsync = async (server) => {
  server.get('/orders', async (request, reply) => {
    const queryParams: QueryParams = request.query as QueryParams;
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const sortBy = queryParams.sort_by || '_id';
    const sortDir = queryParams.sort_dir === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    try {
      const db = server.mongo?.db;
      if (!db) {
        throw new Error('Failed to access MongoDB database');
      }
      const ordersCollection: Collection<Order> = db.collection('orders') as Collection<Order>;
      const orders = await ordersCollection
        .find()
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(limit)
        .toArray();

      const count = await ordersCollection.countDocuments();

      reply.send({
        data: orders,
        pagination: {
          total: count,
          page,
          limit,
        },
      });
    } catch (error) {
      server.log.error(error);
      reply.status(500).send({ message: 'Internal Server Error' });
    }
  });
};

export default getAllOrdersRoute;
