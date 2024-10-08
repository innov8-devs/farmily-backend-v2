import winston from "winston";

// Standard Winston logger for regular application logs
const appLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    // Optionally add file transport
    // new winston.transports.File({ filename: 'app.log' })
  ],
});

// Dedicated logger for Morgan logs, without formatting
const morganLogger = winston.createLogger({
  level: "info",
  format: winston.format.simple(), // Only output plain text messages
  transports: [
    new winston.transports.Console(),
    // Optionally add file transport
    // new winston.transports.File({ filename: 'access.log' })
  ],
});

export { appLogger, morganLogger };
