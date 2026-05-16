import log from "log4js";

export const logger = log
    .configure({
        appenders: {
            console: {
                type: "console",
                layout: {
                    type: "pattern",
                    pattern: "%d{yyyy-MM-dd hh:mm:ss} [%p] %m"
                }
            },
            app: {
                type: "file",
                filename: "logs/app.log",
                pattern: "yyyy-MM-dd",
                alwaysIncludePattern: true,
                daysToKeep: 90,
                compress: true,
            }
        },
        categories: {
            default: {
                appenders: ["console"],
                level: "info"
            }
        }
    })
    .getLogger();