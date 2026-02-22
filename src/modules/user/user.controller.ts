import { Request, Response } from 'express';
import { UserService } from './user.service';

const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUser();
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
    });
  }
};

export const UserController = {
  getUser,
};
