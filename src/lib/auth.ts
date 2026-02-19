import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import config from '../config';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [config.betterAuthUrl],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'STUDENT',
      },
      isBanded: {
        type: 'boolean',
        required: true,
        defaultValue: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },
});
