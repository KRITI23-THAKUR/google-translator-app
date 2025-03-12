import axios from "axios";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
const port = 3000;

const translator_endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
const translator_api_key = process.env.AZURE_TRANSLATOR_API_KEY;
const translator_region = process.env.AZURE_TRANSLATOR_REGION;

app.use(express.json()); // to parse JSON response bodies

app.use(cors());

app.use("/transcribeAudio", express.raw({ type: "audio/webm", limit: "10mb" })); // to parse audio/webm blob files

app.post("/translate", (req, response) => {
  const inputText = req.body.Text;
  const fromLang = req.body.FromLang;
  const targetLang = req.body.TargetLang;

  const from = fromLang == "auto" ? "" : `&from=${fromLang}`;
  const url = `${translator_endpoint}translate?api-version=3.0${from}&to=${targetLang}`;

  axios
    .post(url, [{ Text: inputText }], {
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": translator_api_key,
        "Ocp-Apim-Subscription-Region": translator_region,
        "X-ClientTraceId": uuidv4().toString(),
      },
    })
    .then((res) => {
      const result = res.data[0];
      response.send(result);
    })
    .catch((err) => response.status(500).json({ ServerError: err.message }));
});

app.post("/transcribe", (req, res) => {});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
