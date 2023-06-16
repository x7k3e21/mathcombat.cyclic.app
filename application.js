const express = require("express");
const dotenv = require("dotenv").config();

const environment = process.env.NODE_ENV;

const winston_level = environment == "development" ? "debug" : "warn"; 

const winston = require("winston");
const winston_config = require("./winston");

winston.addColors(winston_config.log_levels_colors);

const winston_format = winston.format.combine
(
	winston.format.colorize({ all: true }),

	winston.format.timestamp
	({ 
		format: "YYYY-MM-DD HH:mm:ss:ms" 
	}),

	winston.format.printf
	(
		(info) => `[${info.level}] ${info.timestamp}: ${info.message}`
	)
);

const winston_transports =
[
	new winston.transports.Console(),
	
	new winston.transports.File
	({
		filename: "environment/logs/default.log"
	}),

	new winston.transports.File
	({
		filename: "environment/logs/errors.log", level: "error" 
	})
];

const winston_logger = winston.createLogger
({
	level: winston_level,
	format: winston_format,

	transports: winston_transports,

	levels: winston_config.log_levels_codes
});

const application = express();

winston_logger.log("debug", "Express.js application was created!");

application.get("/", (request, response) =>
{
	response.send("Yo!");
});

const server = application.listen(process.env.PORT || 3000, () =>
{
	const server_host = server.address().address;
	const server_port = server.address().port;
});