import { Sequelize, DataTypes, Op, QueryTypes, Model, where } from "sequelize";
import express, { NextFunction, Request, Response } from "express";

const port = 3000;
const app = express();

const sequelize = new Sequelize({
  host: "ThanhTai",
  dialect: "mssql",
  database: "hdap",
  username: "sa",
  password: "123456",
  port: 1433,
  dialectOptions: {
    options: {
      trustServerCertificate: true,
    },
  },
});

const client = sequelize.define("client", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
  },
  name: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
});

const clientAddress = sequelize.define("client_address", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  street: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  clientID: {
    type: DataTypes.UUID,
    references: {
      model: client,
      key: "id",
    },
  },
});

client.hasMany(clientAddress, { as: "add" });
client.belongsTo(client, {
  foreignKey: "clientId",
  targetKey: "id",
});

app.use(express.json());

app.get("/get/all", async (req: Request, res: Response) => {
  try {
    const records = await client.findAll({
      limit: req.body.limit,
      offset: req.body.offset,
      order: [[req.body.orderKey, req.body.order]],
    });
    if (records) {
      res.json(records);
    } else {
      res.status(404).json({ error: "Record not found error" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" + error + "hide" });
  }
});

// "b093c7c7-ca6a-44a7-b957-2b270520817d"
app.get("/get/:id", async (req: Request, res: Response) => {
  try {
    console.log();
    const record = await client.findByPk<Model>(req.params.id);
    if (record) {
      res.json(record.dataValues);
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/put/:id", async (req: Request, res: Response) => {
  try {
    const checkExistedClient = await client.findOne<Model>({
      where: {
        id: req.params.id,
      },
    });

    if (!checkExistedClient) {
      res.json("Cannot update");
    } else {
      const record = await client.update(
        {
          ...req.body,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.send(record);
    }
  } catch (err) {
    res.json(err);
  }
});

app.post("/post", async (req: Request, res: Response) => {
  console.log(req.body);
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
