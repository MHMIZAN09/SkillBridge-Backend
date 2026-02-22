import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.get('', UserController.getUser);

export const UserRouter = router;
