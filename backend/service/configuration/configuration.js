// I did copy paste this file. But it is my own creation.
// I created this configuration mechanism in one of my open source frameworks: https://github.com/shrihari-prakash/liquid
import fs from 'fs';

export class Configuration {
    options;

    constructor() {
        const options = fs.readFileSync('./service/configuration/options.json',
            { encoding: 'utf8', flag: 'r' });
        this.options = JSON.parse(options).reduce((options, option) => Object.assign(options, { [option.name]: option }), {});
    }

    get(name, defaultValue, delim = ",") {
        const option = this.options[name];
        if (!option) return defaultValue || undefined;
        const value = process.env[option.envName] || defaultValue || option.default;
        switch (option.type) {
            case "boolean":
                return value === "true" || value === true;
            case "number":
                return typeof value === "string" ? parseInt(value, 10) : value;
            case "numberArray":
                return value.split(delim).map((elem) => parseInt(elem));
            case "stringArray":
                if (Array.isArray(value)) {
                    return value;
                }
                const parsed = value.split(delim);
                return parsed[0] !== "" ? parsed : [];
            case "booleanArray":
                return value.split(delim).map((elem) => elem === "true");
            default:
                return value;
        }
    }

    set(name, value) {
        const option = this.options[name];
        process.env[option.envName] = value + "";
    }
}