import axios from "axios";

const instance = axios.create({
  baseURL: "https://burger-builder-ce87a.firebaseio.com/",
});

export default instance;
