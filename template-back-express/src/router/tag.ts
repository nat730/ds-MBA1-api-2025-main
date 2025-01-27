import { Request, Response, Router } from "express";
import { Tag } from "..";

export const tagRouter = Router();

// ajout tag
tagRouter.post("/tags", async (req: Request, res: Response) => {  
  try {
    const { tag } = req.body;
    console.log(tag);
    

    if (!tag) {
      return res.status(400).json({ error: "Le tag est requis" });
    }

    const newTag = await Tag.create({ tag });
    res.status(201).json(newTag);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});