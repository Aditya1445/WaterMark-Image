const imageForm = document.getElementById("image-form");
const imageInput = document.getElementById("img-input");
const uploadButton = document.getElementById("upload-btn");
const formAlertDOM = document.querySelector(".form-alert");
const showImage = document.getElementById("uploaded-img");
const addWaterMarkButton = document.getElementById("watermarkButton");
const downloadButton = document.getElementById("downloadLink");
const imageInfo = document.querySelector("#image-info");
const loadingDOM = document.querySelector(".loading-text");
const imagePath = document.querySelector("#imagePath");

addWaterMarkButton.disabled = true;
downloadButton.disabled = true;
imageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("upload-file", imageInput.files[0]);
  console.log(formData.get("upload-file"));
  loadingDOM.style.visibility = "visible";
  try {
    const response = await axios.post("/images", formData);

    console.log("response", response);
    if (response.status === 201) {
      const {
        data: { imageFile },
      } = response;
      showImage.src = imageFile.image;
      imageInput.value = "";
      formAlertDOM.style.display = "block";
      formAlertDOM.textContent = `success, Image Successfully Uploaded`;
      formAlertDOM.classList.add("text-success");
      addWaterMarkButton.disabled = false;
      formAlertDOM.classList.add("text-success");
      const imageName = imageFile.image;
      const index = imageName.indexOf("/", imageName.indexOf("/") + 1);
      const filteredName = imageName.substring(index + 1);
      imageInfo.textContent = filteredName;
      imagePath.value = imageFile.image;
    }
  } catch (err) {
    // alert("Something went wrong");
    console.log(err);
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `${err.response.data.image}, please try again.`;
  }
  loadingDOM.style.visibility = "hidden";
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});

addWaterMarkButton.addEventListener("click", async function (e) {
  e.preventDefault();
  addWaterMarkButton.disabled = true;
  const uploadedImage = imagePath.value;
  loadingDOM.style.visibility = "visible";
  try {
    const response = await axios.post("/add-watermark", { uploadedImage });
    console.log(response);
    if (response.status === 200) {
      const {
        data: { waterMarkedFilePath },
      } = response;
      showImage.src = waterMarkedFilePath;
      imagePath.value = "";
      downloadButton.disabled = false;
    }
  } catch (error) {
    console.log(error);
    imageInfo.textContent = "Something went wrong.";
  }
  loadingDOM.style.visibility = "hidden";
  setTimeout(() => {
    addWaterMarkButton.disabled = false;
  }, 3000);
});

downloadButton.addEventListener("click", function (e) {
  e.preventDefault();
  downloadButton.disabled = true;
  try {
    const imageSrc = showImage.getAttribute("src");
    const filename = imageSrc.substring(
      imageSrc.indexOf("/", imageSrc.indexOf("/") + 1) + 1
    );
    if (imageSrc) {
      const a = document.createElement("a");
      a.href = imageSrc;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } catch (error) {
    alert("Something went wrong")
  }
  setTimeout(() => {
    downloadButton.disabled = false;
  }, 2000);
});
