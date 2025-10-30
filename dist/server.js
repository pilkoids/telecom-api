"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const app = (0, app_1.createApp)();
app.listen(config_1.config.port, () => {
    console.log(`Telecom Cart API server listening on port ${config_1.config.port}`);
    console.log(`Environment: ${config_1.config.nodeEnv}`);
    console.log(`Cart expiry: ${config_1.config.cartExpiryMs}ms`);
});
//# sourceMappingURL=server.js.map