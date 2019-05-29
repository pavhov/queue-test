import { Run } from "./lib/decorators/application";
import { Application } from "./lib/abstracts/application";
import { ExpressServer } from "./lib/express/server";
import Connector from "./lib/sequelize/Connector";
import KafkaClient  from "./lib/kafka/KafkaClient";


class App extends Application {
    @Run
    main(): void {
        this.createApp();

        this.db = Connector.getInstance().init();
        this.kafka = KafkaClient.getInstance().init();
        this.server = new ExpressServer(this.app).listen();
    }

    destroy(): void {

    }
}
