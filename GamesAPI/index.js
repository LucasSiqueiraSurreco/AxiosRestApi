import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import { auth } from "./middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(auth);

const DB = {
  games: [{ id: 1, title: "code", year: 1021 }],
  users: [
    { id: 1, name: "Lucas", email: "lucas@gmail.com", password: "12345" },
    { id: 20, name: "V", email: "v@gmail.com", password: "12345" },
  ],
};

app.get("/games", (req, res) => {
  res.status(200).send(DB.games);
});

app.get("/games/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).send("Não é um número de id");
  } else {
    const games = DB.games.find((game) => game.id === id);
    if (games) {
      res.status(201).send(games);
    } else {
      res.status(404).send("Game not found");
    }
  }
});

app.post("/game", (req, res) => {
  const { title, price, year } = req.body;
  const newGame = {
    id: DB.games.length + 1,
    title,
    price,
    year,
  };

  DB.games.push(newGame);
  res.status(201).send(newGame);
});

app.delete("/game/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).send("Não é um número de id");
  } else {
    const gameIndex = DB.games.findIndex((game) => game.id === id);
    if (gameIndex !== -1) {
      DB.games.splice(gameIndex, 1);
      res.status(200).send("Deletado");
    } else {
      res.status(404).send("Game not found");
    }
  }
});

app.put("/game/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    const id = parseInt(req.params.id);

    const game = DB.games.find((g) => g.id == id);

    if (game != undefined) {
      const { title, price, year } = req.body;

      if (title != undefined) {
        game.title = title;
      }

      if (price != undefined) {
        game.price = price;
      }

      if (year != undefined) {
        game.year = year;
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

// Users
app.post("/auth", (req, res) => {
  const { email, password } = req.body;
  if (email !== undefined) {
    const user = DB.users.find((user) => user.email === email);
    if (user !== undefined) {
      if (user.password == password) {
        jwt.sign(
          { id: user.id, email: user.email },
          jwtSecret,
          {
            expiresIn: "48h",
          },
          (err, token) => {
            if (err) {
              res.status(400).json({ err: "Internal error" });
            } else {
              res.status(200).json({ token: token });
            }
          }
        );
      } else {
        res.status(401).json({ err: "Wrong credentials" });
      }
    } else {
      res.status(404).json({ err: "E-mail not found" });
    }
  } else {
    res.status(400).json({ err: "Invalid e-mail" });
  }
});

app.listen(3333, () => console.log("http://localhost:3333"));
