/*** Url and path for fetch */
const API_URL = "http://localhost:5678/api/";

const PATH = {
  LOGIN: "users/login",
  CATEGORIES: "categories",
  GET_WORK: "works",
  POST_WORK: "works",
  DELETE_WORK: (id) => `works/${id}`,
};

/*** GET data db */

async function getData(url) {
  const request = new Request(url, {
    method: "GET",
  });
  try {
    const res = await fetch(request);
    const result = await res.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}

const gallery = document.querySelector(".gallery");

getData(`${API_URL}${PATH.GET_WORK}`).then((data) => {
  data.map((item, index) => {
    gallery.innerHTML += ` ${item.title}`;
  });
});
