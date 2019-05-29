import { Run } from "./lib/decorators/application";
import { Application } from "./lib/abstracts/application";
import Connector from "./lib/sequelize/Connector";

class App extends Application {
    @Run
    main(): void {
        Connector.getInstance().init();
    }

    destroy(): void {

    }
}
