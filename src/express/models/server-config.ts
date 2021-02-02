import IService from '../services/service.interface';
import IController from '../interfaces/controller.interface';

interface ServerConfig {
  /** Port the server will listen on */
  port: number;
  /** The hostname (and port) the app will run on */
  fullHost: string;
  services: IService[];
  modules: IController[];
  middlewares: any[];
}

export default ServerConfig;
