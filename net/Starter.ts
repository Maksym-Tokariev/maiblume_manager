import {Logger} from "./utils/Logger";
import {ServiceContainer} from "./utils/ServiceContainer";
import {MongoConnection} from "./services/mongo/MongoConnection";
import {appConfig} from "./config/AppConfig";

async function main() {
    const logger = new Logger('Starter');
    const mongoConnector = new MongoConnection(appConfig.mongo.uri, appConfig.mongo.dbName);
    await mongoConnector.connect();
    const container = new ServiceContainer(mongoConnector);

    container.myBot.start()
        .then(() => {
            logger.info("Bot has been started")
        })
        .catch(err => {
            logger.error(" Bot error ", err.message);
            mongoConnector.disconnect();
            process.exit(1);
        });
}

main();