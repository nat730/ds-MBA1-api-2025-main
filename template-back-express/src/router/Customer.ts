import { Request, Response, Router } from "express";
import { BlackList, Customer } from "..";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticationMiddleware from "../middleware/middleware_connexion";
import 'dotenv/config';

export const authRouter = Router();

// Login Route
authRouter.post("/me-connecter", async (req: Request, res: Response) => {  
  try {
    
    const { username, password } = req.body;
    const user = await Customer.findOne({ where: { username:username } });
      //@ts-ignore
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const jwtToken = jwt.sign(
      //@ts-ignore
      { userId: user.id},
      process.env.JWT_SECRET!,
    );      
    console.log(jwtToken);
    
    res.status(200).json({ message: "Connexion réussie", jwtToken });
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur", error: error });
  }
});



authRouter.get("/local/user/me", authenticationMiddleware, async (req, res) => {
    //@ts-ignore
  const customer = await Customer.findOne({ where: { id: req.customer?.userId } });
  if (customer) {
    const user = {
    //@ts-ignore
      username: customer.username,
    //@ts-ignore
      password: customer.password
    };
    res.json(user);
  } else {
    res.status(401).json({ error: "Utilisateur non authentifié" });
  }
},

//register
authRouter.post("/local/register", async (req, res) => {
  try {
    const { password, username } = req.body;

    if (!password || !username ) {
      return res
        .status(400)
        .json({
          error: "Veuillez fournir toutes les informations nécessaires.",
        });
    }

    const existingCustomer = await Customer.findOne({ where: { username } });

    if (existingCustomer) {
      return res.status(409).json({ error: "Cet utilisateur existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS!));

    const newCustomer = await Customer.create({
      password: hashedPassword,
      username: username,
    });
    console.log(newCustomer);
    

    if (!newCustomer) {
      throw new Error("Erreur lors de la création du client");
    }

    res.status(201).json(newCustomer);
  } catch (error) {
    // console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
},

authRouter.get("/",async (req, res) => {
  const customers = await Customer.findAll();
  res.json(customers);
})

)
);

// Logout Route
authRouter.post("/local/logout", async (req, res) => {
  try {
    const tokenToBlacklist = req.headers.authorization;

    if (!tokenToBlacklist) {
      return res
        .status(401)
        .json({ error: "Token missing. Authentication required." });
    }

    const [bearer, token] = tokenToBlacklist.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ error: "Incorrect token format. Authentication required." });
    }

    const existingToken = await BlackList.findOne({
      where: { token: token },
    });

    if (existingToken) {
      return res
        .status(409)
        .json({ error: "Ce token a déjà été utilisé pour la déconnexion." });
    }

    // Enregistrement de la déconnexion dans la base de données
    await BlackList.create({ token: token });

    return res.status(204).json({ error: "deconnexion effectuer avec succes" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});