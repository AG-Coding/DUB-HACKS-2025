const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const invokeModel = require("./bedrock.js");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate-content", async (req, res) => {
  try {
    invokeModel("capital of" + req + " please")
      .then((result) => res.json({ content: text }))

      .catch((error) => console.error("Error:", error));
  } catch (error) {
    console.error("Error generating content:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating content" });
  }
});

// Start server
app.listen(8080, () => {
  console.log(`Server is running on http://localhost:8080`);
});
