import 'dotenv/config';
import { fastify } from 'fastify';
import pino from 'pino';
import PinoPretty from 'pino-pretty';
import { fastifyAutoload } from '@fastify/autoload';
import { join } from 'path';
import mongodb from '@fastify/mongodb';

const Port = process.env.PORT || 7000;
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/NFTLogs';
const server = fastify({
    logger: pino(
      PinoPretty({
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      })
    ),
  });
const options = {
    port: 3000
  };
// register plugin below:

const start = async () => {
    
      await server.register(fastifyAutoload, {
        dir: join(__dirname, 'listeners'),
      });
      await server.register(fastifyAutoload, {
        dir: join(__dirname, 'routes'),
      });
      await server.register(mongodb, {
        url: uri,
      });
    try {
        await server.listen(options);
        console.log('Server started successfully');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start(); 