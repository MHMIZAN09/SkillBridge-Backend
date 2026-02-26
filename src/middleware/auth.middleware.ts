import { NextFunction, Request, Response } from 'express';
import { UserRoles } from '../../generated/prisma/enums';

import { auth as betterAuth } from '../lib/auth';
import { User } from '../../generated/prisma/client';
import { prisma } from '../lib/prisma';

const authMiddleware = (...roles: UserRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: No active session found',
        });
      }
      req.user = session.user as User;
      if (roles.length > 0 && !roles.includes(req.user.role as UserRoles)) {
        return res.status(403).json({
          success: false,
          message:
            'Forbidden: You do not have permission to access this resource',
        });
      }
      if (
        roles.includes(UserRoles.TUTOR) &&
        req.user.role === UserRoles.TUTOR
      ) {
        const tutor = await prisma.tutorProfile.findUnique({
          where: { userId: req.user.id },
        });

        if (!tutor) {
          return res.status(404).json({
            success: false,
            message: 'Tutor profile not found',
          });
        }

        req.tutorId = tutor.id;
      }
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
      next(error);
    }
  };
};

export default authMiddleware;
