import axios from "axios";
import { useEffect, useState } from "react";

export default function useLangs() {
  const [languages, setlanguages] = useState([]); // since i want to implement map on this, i'll have to make it an array

  useEffect(() => {
    axios
      .get(
        "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation"
      )
      .then((res) => setlanguages(res.data.translation))
      .catch((err) => console.error("Axios Error: ", err));
  }, []);

  return languages;
}
