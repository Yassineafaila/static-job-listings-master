let JobsContainer = document.querySelector('.Jobs-container');
let searchBox = document.querySelector(".search-box");
let tagSearch = document.querySelector(".tag-search");
let clear = document.querySelector(".clear-search");
let xhr = new XMLHttpRequest();
xhr.open("GET", "data.json");
xhr.send();
xhr.onreadystatechange = function () {
    let data;
    if (xhr.readyState === 4 && xhr.status === 200) {
        data = xhr.responseText;
        data = JSON.parse(data);
    }
    ShowJobs(data);
    
};
function ShowJobs(data) {
   
    data.forEach(element => {
         let JobBox = document.createElement("div");
         JobBox.className = "Job-box";
        JobBox.innerHTML= `<div class="Job-column Job-description Job-column-left">
              <img
                src="${element.logo}"
                alt="${element.company}"
                class="Job-img"
              />
              <div class="Job-info">
                <div class="Job">
                  <span class="Job-company">${element.company}</span>
                  ${moreInfo(element)}
                </div>
                <h3 class="Job-title">${element.position}</h3>
                <ul class="Job-details">
                  <li>${element.postedAt}</li>
                  <li>${element.contract}</li>
                  <li>${element.location}</li>
                </ul>
              </div>
            </div>
            <div class="Job-column Job-Tags Job-column-right">
              <span class="tag search" role="${element.role}">${element.role}</span>
              <span class="tag search" level="${element.level}">${element.level}</span>
              ${createLanguages(element)}
              ${createTools(element)}
            </div>`;
        JobsContainer.append(JobBox)
    });
    

}
function moreInfo(element) {
    let info = '';
    if (element.new === true) {
        info += `<span class="Job-new">New!</span>`;
    } else {
        info = '';
    }
    if (element.featured === true) {
        info += `<span class="Job-featured">featured</span>`;
    } else {
        info = '';
    }
    return info;
}
function createLanguages(element) {
    let languages = '';
    element.languages.forEach((lang) => {
        languages += `<span class="tag search">${lang}</span>`;
    });
    return languages;
}
function createTools(element) {
    let tools = '';
    element.tools.forEach((tool) => {
        tools += `<span class="tag search">${tool}</span>`;
    });
    return tools;
}
let filterArray = [];
//display searchBox:
JobsContainer.addEventListener("click", function (e) {
    let element = e.target;
    if (element.classList.contains("search")) {
        searchBox.classList.remove("hidden");
    }
    displayTags(element)
    
});
//display Tags:
function displayTags(element) {
    let tags = '';
    if (!filterArray.includes(element.textContent)) {
        filterArray.push(element.textContent);
    }
    filterArray.forEach((tag) => {
        tags += `<span class="tag tag-close">${tag}</span>`;
    });
    tagSearch.innerHTML = tags;
    displayOnlyMatchTags()
}
function displayOnlyMatchTags() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "data.json");
    xhr.send();
    let data;
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        data = xhr.responseText;
        data = JSON.parse(data);
      }
      JobsContainer.innerHTML = "";
      data.forEach((item) => {
        if (isValid(item)) {
          let JobBox = document.createElement("div");
          JobBox.className = "Job-box";
          JobBox.innerHTML = `<div class="Job-column Job-description Job-column-left">
              <img
                src="${item.logo}"
                alt="${item.company}"
                class="Job-img"
              />
              <div class="Job-info">
                <div class="Job">
                  <span class="Job-company">${item.company}</span>
                  ${moreInfo(item)}
                </div>
                <h3 class="Job-title">${item.position}</h3>
                <ul class="Job-details">
                  <li>${item.postedAt}</li>
                  <li>${item.contract}</li>
                  <li>${item.location}</li>
                </ul>
              </div>
            </div>
            <div class="Job-column Job-Tags Job-column-right">
              <span class="tag search" role="${item.role}">${item.role}</span>
              <span class="tag search" level="${item.level}">${
            item.level
          }</span>
              ${createLanguages(item)}
              ${createTools(item)}
            </div>`;
            JobsContainer.appendChild(JobBox);
        }
      });
    };
}
function isValid(Obj) {
    let valid = true;
    filterArray.forEach((element) => {
        if (
          Obj.role !== element &&
          Obj.level !== element &&
          !Obj.languages.includes(element) &&
          !Obj.tools.includes(element)
        ) {
          valid = false;
        }
    })
    return valid
}
//add event to search box:
searchBox.addEventListener("click", function (e) {
    let element = e.target;
    if (element.classList.contains("tag-close")) {
        let index = filterArray.indexOf(element.textContent.split(" ")[0].trim());
        filterArray.splice(index, 1);
        element.remove();
        displayOnlyMatchTags();
    }
})
//add event to clear:
clear.addEventListener("click", function () {
    searchBox.classList.add("hidden");
    filterArray = [];
    displayOnlyMatchTags();
})