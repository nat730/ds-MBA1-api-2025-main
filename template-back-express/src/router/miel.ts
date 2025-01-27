import { Request, Response, Router } from "express";
import { Customer, Miel } from "..";
import { stringify } from "querystring";

export const mielRouter = Router();

// ajout miel
mielRouter.post("/miels", async (req: Request, res: Response) => {  
  try {
    
    const { nom ,description,prix } = req.body;

    if (!nom || !description || !prix ) {
        return res
          .status(400)
          .json({
            error: "Veuillez fournir toutes les informations nécessaires.",
          });
      }

    const existingMiel = await Miel.findOne({ where: { nom } });
    
    if (existingMiel) {
      return res.status(409).json({ error: "Ce miel existe déjà" });
    }
    
    const newMiel = await Miel.create({nom,description,prix });
    console.log(newMiel);
    
    res.status(200).json({ message: "miel ajouté", newMiel });
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur", error: error });
  }
});


//chercher un miel
mielRouter.get("/miels/:id", async (req, res) => {
  try {
    const mielID = req.params.id;

    const miel = await Miel.findOne({ where: { id: mielID } });

    if (miel) {
      res.json({
        nom: miel.nom,
        description: miel.description,
        tag_id: miel.tag_id
      });
    } else {
      res.status(404).json({ error: "Miel non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du miel :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});


///chercher tout les miels
mielRouter.get("/miels", async (req, res) => {
  try {
    const miels = await Miel.findAll();
    res.json(miels);
  } catch (error) {
    console.error("Erreur lors de la récupération des miels :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});


  mielRouter.put("/miels/:id/prix/:prix", async (req, res) => {
    try {
      const mielID = req.params.id;
      const prix = req.params.prix;
      const { nom, description } = req.body;
  
      const prixn = parseInt(prix)
      if (isNaN(prixn)) {
        return res.status(400).json({ error: "'prix' doit être un nombre valide" });
      }
  
      const mielToUpdate = await Miel.findByPk(mielID);
  
      if (!mielToUpdate) {
        return res.status(404).json({ error: "Le miel n'a pas été trouvé." });
      }

      mielToUpdate.prix = prix;
      if (nom) mielToUpdate.nom = nom;
      if (description) mielToUpdate.description = description;
  
      await mielToUpdate.save();
  
      res.status(200).json({
        message: "Le miel a été modifié avec succès.",
        updatedMiel: mielToUpdate
      });
    } catch (error) {
      console.error("Erreur lors de la modification du miel :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }),
  
mielRouter.delete("/miels/:id", async (req, res) => {
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