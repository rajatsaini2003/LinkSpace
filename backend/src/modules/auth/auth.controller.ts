import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { signupSchema, loginSchema, refreshSchema } from './auth.validation';
import { sendSuccess } from '../../utils/apiResponse';

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = signupSchema.parse({ body: req.body });
    const result = await authService.signup(body);
    sendSuccess(res, result, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = loginSchema.parse({ body: req.body });
    const result = await authService.login(body);
    sendSuccess(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = refreshSchema.parse({ body: req.body });
    const result = await authService.refresh(body);
    sendSuccess(res, result, 'Token refreshed');
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    sendSuccess(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
}
