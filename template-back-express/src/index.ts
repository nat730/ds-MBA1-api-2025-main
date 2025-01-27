import express from "express"
import "dotenv/config"
import cors from 'cors'
import { authRouter } from "./router/Customer";
import { Sequelize } from "sequelize";

const port = process.env.PORT ? parseInt(process.env.PORT as string) : 3000
const app = express();
app.use(cors());

import { CustomerModel } from "./models/customer";
import { BlackListModel } from "./models/black_list";
import { MielModel } from "./models/miel";
import { mielRouter } from "./router/miel";
import { TagModel } from "./models/tag";
import { tagRouter } from "./router/tag";


export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite'
});

export const Customer = CustomerModel(sequelize);
export const BlackList = BlackListModel(sequelize);
export const Miel = MielModel(sequelize);
export const Tag = TagModel(sequelize);




sequelize.sync({ force: true });
sequelize.sync();


app.use(cors());
app.use(express.json());

const apiRouter = express.Router();
apiRouter.use('/', authRouter);
apiRouter.use('/', mielRouter);
apiRouter.use('/', tagRouter);




app.use("/", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});