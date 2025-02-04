/*** Url and path for fetch */
const API_URL = "http://localhost:5678/api/";

const PATH = {
  CATEGORIES: "categories",
  GET_WORK: "works",
  POST_WORK: "works",
  DELETE_WORK: (id) => `works/${id}`,
};

/** Variable Global */
const gallery = document.querySelector(".gallery");

const btnsBar = document.querySelector(".btns-filter-bar");

const editBar = document.querySelector(".editor-bar");
const editBtn = document.querySelector(".btn-modal-editor");
const btnLogin = document.querySelector(".menu-login-btn");

const modal = document.querySelector(".modal");
const mdGallery = document.querySelector(".md-gallery");

const mdIconClose = document.querySelector(".md-icon-close ");

const btnModalAddData = document.querySelector(".md-btn-add");
const modalAddData = document.querySelector(".modal-add-data");
const modalData = document.querySelector(".modal-data");

const barModalData = document.querySelector(".ma-bar");
const select = document.querySelector(".select");

const btnAddData = document.querySelector(".md-btn-add.data");
const titleValue = document.querySelector(".ma-input.title");
const formImg = document.querySelector(".ma-form-img");

const errorAddData = document.querySelector(".error.add-data");

const iconImg = formImg.children[0];
const imgDisplay = formImg.children[1];
const fileInput = formImg.children[2];
const btnAddFile = formImg.children[3];
const imgInfo = formImg.children[4];

let file = "";
/** GET data db */

async function getData(url) {
  const request = new Request(url, {
    method: "GET",
  });
  try {
    const res = await fetch(request);
    const result = await res.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}

/** Display data */

function getAndDisplay(name) {
  gallery.replaceChildren();
  getData(`${API_URL}${PATH.GET_WORK}`).then((data) => {
    if (!name) {
      mapImageGallery(data);
    } else {
      const dataFilter = new Set();
      dataFilter.add(data.filter((n) => n.category.name == name));
      const dataArray = Array.from(dataFilter)[0];
      mapImageGallery(dataArray);
    }
  });
}

function mapImageGallery(data) {
  data.map((item) => {
    const figure = document.createElement("figure");
    const figcaption = document.createElement("figcaption");
    const img = document.createElement("img");
    figcaption.innerHTML = item.title;
    img.setAttribute("src", item.imageUrl);
    img.classList.add("gallery-img");
    figure.setAttribute("id", item.id);
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

getAndDisplay();

/** Events btns filter */

btnsBar.addEventListener("click", filterImageFunction);

function filterImageFunction(e) {
  Array.from(btnsBar.children).map((item) => {
    item.style.backgroundColor = "#fff";
    item.style.color = "#1d6154";
  });
  if (e.target.innerHTML.length <= 24) {
    e.target.style.backgroundColor = "#1d6154";
    e.target.style.color = "#fff";
  }
  if (e.target.innerHTML == "Tous") {
    getAndDisplay(undefined);
  } else if (e.target.innerHTML.toString().charAt(0) == "H") {
    const name = e.target.innerHTML.replace("&amp;", "&");
    getAndDisplay(name);
  }
  getAndDisplay(e.target.innerHTML);
}

/** Mod Editor */

displayModEditor("user");

function displayModEditor(item) {
  if (localStorage.getItem(item)) {
    editBar.style.display = "flex";
    editBtn.style.display = "flex";
    btnsBar.style.display = "none";
    btnLogin.innerHTML = "logout";

    btnLogin.addEventListener("click", () => {
      localStorage.removeItem(item);
    });
  }
}

/** Modal */

editBtn.addEventListener("click", showModal);
mdIconClose.addEventListener("click", closeModal);

function showModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

getData(`${API_URL}${PATH.GET_WORK}`).then((data) => {
  mapImageModal(data);
});

mdGallery.addEventListener("click", deleteImage);

async function deleteImage(e) {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = e.target.id;
  if (id !== "") {
    try {
      const res = await fetch(`${API_URL}${PATH.DELETE_WORK(id)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.status == 204) {
        getChildDelete(mdGallery, id);
        getChildDelete(gallery, id);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

function getChildDelete(parent, id) {
  let test = Array.from(parent.children).filter(
    (n) => n.getAttribute("id") == id
  );
  parent.removeChild(test[0]);
}
// Display images
function mapImageModal(data) {
  data.map((item) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const i = document.createElement("i");
    i.classList.add("md-icon-trash", "fa-solid", "fa-trash-can");
    img.setAttribute("src", item.imageUrl);
    img.classList.add("md-img");
    i.setAttribute("id", item.id);
    figure.setAttribute("id", item.id);
    figure.appendChild(i);
    figure.appendChild(img);
    mdGallery.appendChild(figure);
  });
}

/** Modal add Data*/

btnModalAddData.addEventListener("click", showModalAdd);

function showModalAdd() {
  modalAddData.style.display = "flex";
  modalData.style.display = "none";
}

function closeModalAdd() {
  modalAddData.style.display = "none";
  modalData.style.display = "flex";
}

barModalData.addEventListener("click", closeAndBack);
// Icon return and Icon close with reset form
function closeAndBack(e) {
  if (e.target.classList.contains("ma-icon-back")) {
    modalAddData.style.display = "none";
    modalData.style.display = "flex";
    displayFormImg(false);
  } else if (e.target.classList.contains("ma-icon-close")) {
    displayFormImg(false);
    closeModal();
  }
}

getCategories();

function getCategories() {
  getData(`${API_URL}${PATH.CATEGORIES}`).then((data) => {
    data.map((item, index) => {
      const option = document.createElement("option");
      option.setAttribute("value", item.id);
      option.innerHTML = item.name;
      select.appendChild(option);
    });
  });
}

/** Add and display file */

btnAddFile.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files[0].name) {
    file = fileInput.files[0];
    displayFormImg(true, file);
  } else {
    return;
  }
});

titleValue.addEventListener("input", checkValuesForm);
select.addEventListener("change", checkValuesForm);
fileInput.addEventListener("change", checkValuesForm);
// Change color et pointer event btn
function checkValuesForm() {
  if (titleValue.value !== "" && select.value !== "" && file !== "") {
    btnAddData.style.backgroundColor = "#1d6154";
    btnAddData.style.pointerEvents = "auto";
  } else {
    btnAddData.style.backgroundColor = "#a7a7a7";
    btnAddData.style.pointerEvents = "none";
  }
}

btnAddData.addEventListener("click", addNewImage);

async function addNewImage(e) {
  e.preventDefault();
  const title = titleValue.value;
  const category = select.value;
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", category);
  const user = JSON.parse(localStorage.getItem("user"));

  try {
    validFormData(title, category, file);
    const res = await fetch(`${API_URL}${PATH.POST_WORK}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });
    if (res.status !== 201) {
      return errorCatch(errorAddData, "Une erreur s'est produite");
    } else if (res.status == 201) {
      displayFormImg(false);
      const newData = [await res.json()];
      mapDataGallery(newData);
      mapDataModal(newData);
      closeModalAdd();
    }
  } catch (err) {
    console.error(err);
  }
}
// handle error form addImage
function validFormData(title, category, file) {
  if (!title || !category || !file) {
    errorCatch(errorAddData, "Une ou des informations sont manquantes");
    throw new Error("Une ou des informations sont manquantes");
  }
}
// Change display form for add image
function displayFormImg(bool, file) {
  if (bool == true) {
    imgDisplay.setAttribute("src", `/FrontEnd/assets/images/${file.name}`);
    imgDisplay.style.display = "inline-block";
    iconImg.style.display = "none";
    btnAddFile.style.display = "none";
    imgInfo.style.display = "none";
  } else if (bool == false) {
    document.querySelector(".ma-form").reset();
    fileInput.value = "";
    imgDisplay.setAttribute("src", "");
    imgDisplay.style.display = "none";
    iconImg.style.display = "inline-block";
    btnAddFile.style.display = "inline-block";
    imgInfo.style.display = "inline-block";
  }
}

/** Handle error */

function errorCatch(errorElement, text) {
  errorElement.innerHTML = `${text}`;
  errorElement.style.display = "inline-block";
}

function closeError(errorElement) {
  errorElement.style.display = "none";
}
