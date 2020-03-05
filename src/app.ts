import "reflect-metadata";
// express
import express, { Express, Request, Response, Router } from "express";

// middlewares
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { createConnection } from "typeorm";

import rootRoutes from "./routes";
import { Logger, ILogger } from "./utils/logger";
import config from "./config";

// error handler
import notFoundError from "./middlewares/notFoundHandler";
import errorMiddleware from "./middlewares/errorHandler";
import { classToPlain } from "class-transformer";

export class Application {
  app: Express;
  router: Router = express.Router();
  logger: ILogger;
  config = config;

  constructor() {
    // create express app
    this.app = express();

    this.logger = new Logger(__filename);

    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(
      morgan("dev", {
        skip: () => config.environment === "test"
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.get("/", (_req: Request, res: Response) => {
      res.json({
        message: "hello world"
      });
    });

    this.initRoutes();

    this.app.use(notFoundError);

    this.app.use(errorMiddleware);
  }

  initRoutes = () => {
    // register express routes from defined application routes
    rootRoutes.forEach(route => {
      this.app.use(
        "/api",
        (this.router as any)[route.method](
          route.route,
          route.middlewares,
          (req: Request, res: Response, next: Function) => {
            const result = new (route.controller as any)()[route.action](
              req,
              res,
              next
            );
            if (result instanceof Promise) {
              result
                .then(result =>
                  result !== null && result !== undefined
                    ? res.json({ success: true, data: classToPlain(result) })
                    : res.status(404).json({ success: false })
                )
                .catch(e => next(e));
            }
          }
        )
      );
    });
  };

  setupDbAndServer = async () => {
    try {
      await this.setupDb();
      await this.startServer();
    } catch (e) {
      this.logger.error(e);
    }
  };

  setupDb = async () => {
    await createConnection();
  };

  startServer = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.app
        .listen(+this.config.port, this.config.host, () => {
          this.logger.info(
            `Server started at http://${this.config.host}:${this.config.port}`
          );
          resolve(true);
        })
        .on("error", err => {
          this.logger.error(err.toString());
          reject(false);
        });
    });
  };
}
