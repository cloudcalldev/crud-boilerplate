
import * as AWS from "aws-sdk";
import * as Bunyan from "bunyan";
import { IApplicationConfiguration } from "../interfaces";
import { Logger } from "./logger";

const logger: Bunyan = Logger.getInstance();

/**
 * Configuration class for ASM (Amazon Secrets Manager)
 */
export class Configuration {

    private static _asmRegion = process.env.ASM_REGION || "<YOUR REGION HERE>";
    private static _asmSecretName = process.env.ASM_SECRET || "<YOUR SERVICE NAME HERE>";
    private static _config: IApplicationConfiguration;

    /**
     * Called on load of the application
     * It gets the config and loads it into a private variable that is then accessed with a getter
     * @returns Promise
     */
    public static async getCredentials(): Promise<IApplicationConfiguration> {
        try {
            if (!this._config) {
                if (!this._asmRegion || !this._asmSecretName) { throw new Error("No region or secret name passed to the config"); }
                const client = new AWS.SecretsManager({ region: this._asmRegion });
                const result = await client.getSecretValue({ SecretId: this._asmSecretName }).promise();
                if (!result.SecretString) {
                    throw new Error("No ASM config");
                }
                this._config = JSON.parse(result.SecretString);
            }

            return this._config;
        } catch (err) {
            logger.error("Failed to get AWS secret", err);
            throw new Error("Failed to get AWS secret");
        }
    }

    /**
     * Called by any services that need to get the config
     * @returns IApplicationConfiguration
     */
    public static getConfig(): IApplicationConfiguration {
        return this._config;
    }
}
