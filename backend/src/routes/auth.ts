import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../types/index';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as AuthRequest;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await AuthService.registerUser(email, password);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as AuthRequest;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { user, token } = await AuthService.loginUser(email, password);
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
      },
      token: token.token,
      expiresIn: token.expiresIn,
    });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
});

export default router;
