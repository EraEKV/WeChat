import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import AuthController from './auth-controller';
import AuthService from './auth-service';

const authRouter = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

authRouter.post('/register', authController.registerUser);
authRouter.post('/login', authController.loginUser);
authRouter.post('/refresh-token', authController.refreshToken);



export default authRouter;
