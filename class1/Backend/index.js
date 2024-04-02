import express from "express";

const app = express();

const post = 3000;

app.get("/api/items", (req, res) => {
  const itemList = [
    { id: 1, itemName: "A" },
    { id: 2, itemName: "B" },
    { id: 3, itemName: "C" },
    { id: 4, itemName: "D" },
    { id: 5, itemName: "E" },
    { id: 6, itemName: "F" },
    { id: 7, itemName: "G" },
    { id: 8, itemName: "H" },
    { id: 9, itemName: "I" },
    { id: 10, itemName: "J" },
  ];

  res.json(itemList);
});

app.listen(post, (req, res) => {
  console.log(`Server is listing on Part No: ${post}`);
});
