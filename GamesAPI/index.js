import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const DB = {
  games: [],
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

app.put("/game/:id", (req, res) => {});

app.listen(3333, () => console.log("http://localhost:3333"));
