import {Router} from 'express';

interface IController {
  router: Router;
  path: string;
}

export default IController;
