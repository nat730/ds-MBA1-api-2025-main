import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";


const authenticationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ error: "Token manquant. Authentification requise." });
    }

    const [bearer, token] = authorizationHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ error: "Format de token incorrect. Authentification requise." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            role: string; userId: number
        };

        // req.customer = {
        //     userId: decoded.userId,
        //     role: decoded.role
        // };
        
        next();

    } catch (error) {
        return res
            .status(401)
            .json({ error, message: "Token invalide. Authentification requise." });
    }
};

export default authenticationMiddleware;