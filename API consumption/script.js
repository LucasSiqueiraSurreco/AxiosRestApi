function createGame() {
  const titleInput = document.querySelector("#title");
  const yearInput = document.querySelector("#year");
  const priceInput = document.querySelector("#price");

  const game = {
    title: titleInput.value,
    year: yearInput.value,
    price: priceInput.value,
  };

  axios
    .post("http://localhost:3333/game", game)
    .then((res) => {
      if (res.status == 201) {
        window.location.reload();
        //alert("Registered game!");
      }
    })
    .catch((err) => console.log(err));
}

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    createGame();
  }
});

function deleteGame(listItem) {
  const id = listItem.getAttribute("data-id");
  axios
    .delete("http://localhost:3333/game/" + id)
    .then((res) => {
      window.location.reload();
      //alert("Deleted Game");
    })
    .catch((err) => console.log(err));
}

function loadForm(listItem) {
  const id = listItem.getAttribute("data-id");
  const title = listItem.getAttribute("data-title");
  const year = listItem.getAttribute("data-year");
  const price = listItem.getAttribute("data-price");
  document.querySelector("#idEdit").value = id;
  document.querySelector("#titleEdit").value = title;
  document.querySelector("#yearEdit").value = year;
  document.querySelector("#priceEdit").value = price;
}

function updateGame() {
  const idInput = document.querySelector("#idEdit");
  const titleInput = document.querySelector("#titleEdit");
  const yearInput = document.querySelector("#yearEdit");
  const priceInput = document.querySelector("#priceEdit");

  const game = {
    title: titleInput.value,
    year: yearInput.value,
    price: priceInput.value,
  };

  const id = idInput.value;
  axios
    .put("http://localhost:3333/game/" + id, game)
    .then((res) => {
      if (res.status == 200) {
        //alert("Updated game");
        window.location.reload();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

axios
  .get("http://localhost:3333/games")
  .then((res) => {
    const games = res.data;
    const list = document.querySelector("#games");

    games.forEach((game) => {
      const item = document.createElement("li");
      item.setAttribute("data-id", game.id);
      item.setAttribute("data-title", game.title);
      item.setAttribute("data-year", game.year);
      item.setAttribute("data-price", game.price);

      item.innerHTML = `Name: ${game.title} - Year: ${game.year} - Price: ${game.price}R$ `;

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "Delete";
      deleteBtn.addEventListener("click", function () {
        deleteGame(item);
      });

      const editBtn = document.createElement("button");
      editBtn.innerHTML = "Edit";
      editBtn.addEventListener("click", function () {
        loadForm(item);
      });

      item.appendChild(deleteBtn);
      item.appendChild(editBtn);

      list.appendChild(item);
    });
  })
  .catch((err) => console.log(err));
