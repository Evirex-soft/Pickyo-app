import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {

  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);
    req.user = decoded;
    return next();

  } catch (error: any) {

    if (error.name === "TokenExpiredError") {

      if (!refreshToken) {
        return res.status(401).json({ message: "Session expired" });
      }

      try {

        const decodedRefresh: any = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET!
        );

        const newAccessToken = jwt.sign(
          { userId: decodedRefresh.userId, role: decodedRefresh.role },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax"
        });

        req.user = decodedRefresh;

        return next();

      } catch {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

    }

    return res.status(401).json({ message: "Invalid token" });
  }
};
