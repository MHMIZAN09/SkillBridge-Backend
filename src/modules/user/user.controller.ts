import type { Request, Response } from 'express';
import { UserService } from './user.service';
import type { User } from '../../../generated/prisma/client';
import paginationSortingHelper from '../../utills/paginationHelper';

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getUser(req.user as User);
    return res.status(200).json({
      success: true,
      message: 'User data retrieved successfully',
      data: result,
    });
  } catch (e) {
    return res.status(400).json({
      // fix: add return
      success: false,
      message: e instanceof Error ? e.message : 'Failed to retrieve user data',
    });
  }
};

const listUsers = async (req: Request, res: Response) => {
  try {
    const pagination = paginationSortingHelper(req.query);
    const result = await UserService.listUsers(pagination);
    return res.status(200).json({
      success: true,
      message: 'Users data retrieved successfully',
      data: result,
    });
  } catch (e) {
    return res.status(400).json({
      // fix: add return
      success: false,
      message: e instanceof Error ? e.message : 'Failed to retrieve users data',
    });
  }
};

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    if (!req.body?.status) {
      return res
        .status(400)
        .json({ success: false, message: 'Status is required' });
    }

    const result = await UserService.updateUserStatus(
      req.body.status,
      req.params.userId as string,
    );

    return res.status(200).json({
      success: true,
      message: 'User status updated',
      data: result,
    });
  } catch (e) {
    return res.status(400).json({
      // fix: add return
      success: false,
      message: e instanceof Error ? e.message : 'Failed to update user status',
    });
  }
};

const updateUserData = async (req: Request, res: Response) => {
  try {
    const result = await UserService.updateUserData(req.body, req.user as User);
    return res.status(200).json({
      success: true,
      message: 'Updated successfully',
      data: result,
    });
  } catch (e) {
    return res.status(400).json({
      // fix: add return
      success: false,
      message: e instanceof Error ? e.message : 'Failed to update user data',
    });
  }
};

export const UserController = {
  getUser,
  listUsers,
  updateUserStatus,
  updateUserData,
};
