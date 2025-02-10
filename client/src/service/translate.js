import axios from "axios";

export default async function translateText(text, targetLang, fromLang) {
  const from = fromLang == "auto" ? "" : `&from=${fromLang}`;
  console.log(import.meta.env.VITE_AZURE_TRANSLATOR_ENDPOINT);
  const url = `${
    import.meta.env.VITE_AZURE_TRANSLATOR_ENDPOINT
  }translate?api-version=3.0${from}&to=${targetLang}`;

  console.log(url);
  const response = axios
    .post(url, [{ Text: text }], {
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": import.meta.env
          .VITE_AZURE_TRANSLATOR_API_KEY,
        "Ocp-Apim-Subscription-Region": import.meta.env
          .VITE_AZURE_TRANSLATOR_REGION,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data[0];
    })
    .catch((err) => console.error(err));

  return response;
}
