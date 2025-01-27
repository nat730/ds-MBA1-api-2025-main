import { Request, Response, Router } from "express";
import { Customer, Miel } from "..";
import authenticationMiddleware from "../middleware/middleware_connexion";
import 'dotenv/config';

export const mielRouter = Router();

// ajout miel
mielRouter.post("/miels", async (req: Request, res: Response) => {  
  try {
    
    const { nom ,bio, tag_id } = req.body;
    if (!nom || !bio || !tag_id ) {
        return res
          .status(400)
          .json({
            error: "Veuillez fournir toutes les informations nécessaires.",
          });
      }

      const existingMiel = await Customer.findOne({ where: { nom } });

    if (existingMiel) {
      return res.status(409).json({ error: "Ce miel existe déjà" });
    }

    const miel = await Miel.findOne({ where: { tag:tag_id } });

    if (!miel) {
      return res.status(401).json({ error: "Manque d'infos" });
    }

    const newMiel = await Customer.create({nom,bio,tag_id });
    
    res.status(200).json({ message: "miel ajouté", newMiel });
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur", error: error });
  }
});


//chercher un miel
mielRouter.get("/miels/:id", authenticationMiddleware, async (req, res) => {
    //@ts-ignore
  const miel = await Miel.findOne({ where: { id: req.miel.nom } });
  if (miel) {
    const miel: { nom: string; bio: boolean; tag_id: number }[] = {
    //@ts-ignore
      nom: miel.nom,
    //@ts-ignore
      bio: miel.bio,
    //@ts-ignore
     tag_id:miel.tag_id
    };
    res.json(miel);
  } else {
    res.status(401).json({ error: "Utilisateur non authentifié" });
  }
},

///chercher tout les miels
mielRouter.get("/miels", authenticationMiddleware, (req, res) => {
  try {
    const miel = Miel.findAll
    res.json(miel);
  } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }
  ,
  ///modifier miel
  mielRouter.put("/:id",authenticationMiddleware, async (req, res) => {
    try {
      const mielID = req.params.id;
      const { nom, bio } = req.body;
  
      if (!nom || !bio) {
        return res
          .status(400)
          .json({
            error:
              "Veuillez fournir le nom et si le miel est bio.",
          });
      }
  
      const categoryToUpdate = await Miel.findByPk(mielID);
  
      if (categoryToUpdate) {
        await categoryToUpdate.update({ nom, bio });
        res
          .status(200)
          .json({ message: "Le miel a été modifiée avec succès." });
      } else {
        res.status(404).json({ error: "La catégorie n'a pas été trouvée." });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la modification de la catégorie par ID :",
        error,
      );
      res.status(500).json({ error: "Erreur interne du serveur" });
    }

}),
mielRouter.delete("/:id",authenticationMiddleware, async (req, res) => {
    try {
      const mielID = req.params.id;
      const mielToDelete = await Miel.findByPk(mielID);
  
      if (!mielToDelete) {
        return res.status(404).json({ error: "miel non trouvée." });
      }
  
      await mielToDelete.destroy();
  
      res.status(200).json({ message: "Le miel a été supprimée." });
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du miel par ID :",
        error,
      );
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  })
)
);