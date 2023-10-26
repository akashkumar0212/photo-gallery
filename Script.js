const imageWrapper = document.querySelector(".images")
const loadMoreBtn = document.querySelector(".load-more")
const searchInput = document.querySelector(".search-box input")
const lightBox = document.querySelector(".lightbox")
const closeBtn = document.querySelector(".uil-times")
const downloadBtn = document.querySelector(".uil-import")

// API keys, pagination , searchTerm variables
const apiKey = "RzW6d77iIPUHIBvxw9HBXnrR8dmE4CvHpvvBEpZpfH1QX38I3aIam6UQ"
const perPage = 15;
let currentPage = 1;
searchTerm = null;
const downloadImg = (imgURL) => {
// converting recived image to blob, crating it's download link & downloading it    
    fetch(imgURL).then(res => res.blob()).then(file =>{
        //URL.createObjectURL() creates url of passed object
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        //Passing current time is m/s as <a> download value
        a.download = new Date().getTime();
        a.click();
    }).catch(() =>{alert("Failed to download image !")})
}

const showLightbox  = (name, img) => {
    // showing lightbox and setting img source, name and button attribute
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerHTML = name;
    downloadBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden"
}
const hideLightBox = () => {
    lightBox.classList.remove("show")
    document.body.style.overflow = "auto" 
}
const generateHTML = (images) => {
    // making li of all fetched images and adding them to the existing image wrapper
    imageWrapper.innerHTML += images.map(img =>
        `<li class="card">
        <img onclick="showLightbox('${img.photographer}', '${img.src.large2x}')" src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
               <button onClick = "downloadImg('${img.src.large2x}')">
                    <i class="uil uil-import"></i>
               </button>
       </div>
   </li>`
    ).join("")
}

const getImages = (apiURL) => {
    // ferching images by api call with authorization header
    loadMoreBtn.innerText = "loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos)
        loadMoreBtn.textContent = "Load more";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert('Failed to load !, please enter some value'))

}
const loadMoreImages = () => {
    currentPage++; // increment current page by 1
    // if searchTerm has same then call API with search term else call default API 
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}
const loadSearchImage = (e) => {
    // if the search input is empty, set the search trm to null and return from here
    if (searchTerm === "") return null;
    // if pressed key is enter, update the current page, search term & call the getImages
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imageWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }
}


getImages(`https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`)

loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImage);
closeBtn.addEventListener("click", hideLightBox);
// passing btn image attribute value as argument to the downloadbtn function
downloadBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));
