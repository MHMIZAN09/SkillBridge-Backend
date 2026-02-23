import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import config from '../config';
import nodemailer from 'nodemailer';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { UserRoles } from '../../generated/prisma/enums';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: config.appUser!,
    pass: config.appPass!,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [config.appUrl!],

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
      },
      status: {
        type: 'string',
        defaultValue: 'ACTIVE',
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
      await transporter.sendMail({
        from: `"SkillBridge" <${config.appUser}>`,
        to: user.email,
        subject: 'Verify your email - SkillBridge',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Email</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px 0;">
          <tr>
            <td align="center">
              
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="background:#4f46e5;padding:30px 20px;color:#ffffff;">
                    <h1 style="margin:0;font-size:24px;">SkillBridge 🎓</h1>
                    <p style="margin:8px 0 0;font-size:14px;">Connect with Expert Tutors</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 30px;color:#333333;">
                    <h2 style="margin-top:0;">Hello ${user.name || 'there'},</h2>
                    <p style="font-size:16px;line-height:1.6;">
                      Thank you for signing up with <strong>SkillBridge</strong>.
                      Please confirm your email address by clicking the button below.
                    </p>

                    <div style="text-align:center;margin:30px 0;">
                      <a href="${url}" 
                         style="background:#4f46e5;color:#ffffff;text-decoration:none;
                                padding:14px 28px;border-radius:6px;
                                font-size:16px;font-weight:bold;
                                display:inline-block;">
                        Verify Email
                      </a>
                    </div>

                    <p style="font-size:14px;color:#666;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>

                    <p style="word-break:break-all;font-size:12px;color:#888;">
                      ${url}
                    </p>

                    <p style="font-size:14px;margin-top:30px;">
                      If you did not create this account, you can safely ignore this email.
                    </p>

                    <p style="margin-top:40px;">
                      Best Regards,<br/>
                      <strong>SkillBridge Team</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="background:#f9fafb;padding:20px;font-size:12px;color:#999;">
                    © ${new Date().getFullYear()} SkillBridge. All rights reserved.
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
      });
    },
  },
  socialProviders: {
    google: {
      prompt: 'select_account',
      accessType: 'offline',
      clientId: config.googleClientId as string,
      clientSecret: config.googleClientSecret as string,
    },
  },
  hooks: {
    before: createAuthMiddleware(async (tx) => {
      if (tx.path === '/sign-up/email') {
        if (tx.body.role === UserRoles.ADMIN) {
          throw new APIError(403, {
            message: 'Admin registration is not allowed',
          });
        }
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.role === UserRoles.TUTOR) {
            try {
              // Check if tutor profile already exists
              const existing = await prisma.tutorProfile.findUnique({
                where: { userId: user.id },
              });

              if (!existing) {
                const result = await prisma.tutorProfile.create({
                  data: {
                    userId: user.id,
                  },
                });
                console.log('TutorProfile created:', result);
              } else {
                console.log('TutorProfile already exists for user:', user.id);
              }
            } catch (error) {
              console.error(
                'Error creating TutorProfile for user:',
                user.id,
                error,
              );
              throw error; // Important: propagate the error
            }
          }
        },
      },
    },
  },
});
