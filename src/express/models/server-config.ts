import IService from '../services/service.interface';
import IController from '../interfaces/controller.interface';

interface ServerConfig {
  /** Port the server will listen on */
  port: number;
  services: IService[];
  modules: IController[];
  middlewares: any[];
}

export default ServerConfig;
