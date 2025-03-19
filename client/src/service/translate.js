import axios from "axios";

export default async function translateText(text, targetLang, fromLang) {
  const response = axios
    .post(
      "http://localhost:5000/translate",
      { Text: text, TargetLang: targetLang, FromLang: fromLang },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((err) => console.error(err));

  return response;
}
