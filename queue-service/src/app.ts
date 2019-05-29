import { Run } from "./lib/decorators/application";
import { Application } from "./lib/abstracts/application";
import Connector from "./lib/sequelize/Connector";
import KafkaClient  from "./lib/kafka/KafkaClient";
import Runner from "./stores/jobs/runner";


class App extends Application {
    @Run
    main(): void {
        this.db = Connector.getInstance().init();
        this.kafka = KafkaClient.getInstance().init();
        Runner.getInstance().init();
    }

    destroy(): void {

    }
}
