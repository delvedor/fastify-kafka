
import { FastifyPlugin } from 'fastify';
import { ConsumerGlobalConfig, ConsumerTopicConfig, KafkaConsumer, Message, MetadataOptions, Producer, ProducerGlobalConfig, ProducerTopicConfig } from 'node-rdkafka';

declare module 'fastify' {
    interface FastifyKafkaMessage extends Pick<Message, 'topic' | 'partition' | 'key'> {
        payload: unknown;
    }

    interface FastifyKafkaProducer {
        producer: Producer;
        push(message: FastifyKafkaMessage): void;
        stop(done: () => void): void;
    }

    interface FastifyKafkaConsumer extends Pick<KafkaConsumer, 'consume' | 'subscribe'> {
        consumer: KafkaConsumer;
        stop(done: () => void): void;
    }

    interface Kafka extends Pick<FastifyKafkaProducer, 'push'>, Pick<FastifyKafkaConsumer, 'consume' | 'subscribe'> {
        producer?: FastifyKafkaProducer;
        consumer?: FastifyKafkaConsumer;
    }
    interface FastifyInstance {
        kafka: Kafka;
    }
}

declare namespace fastifyKafka {
    export interface FastifyKafkaOptions {
        producer?: ProducerGlobalConfig;
        consumer?: ConsumerGlobalConfig;
        producerTopicConf?: ProducerTopicConfig;
        consumerTopicConf?: ConsumerTopicConfig;
        metadataOptions?: MetadataOptions;
    }
}

declare const fastifyKafka: FastifyPlugin<fastifyKafka.FastifyKafkaOptions>;

export default fastifyKafka;