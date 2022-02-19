const form = document.querySelector("form"),
    fileInput = document.querySelector(".upload-model__upload-file-input"),
    progressArea = document.querySelector(".upload-model__progress-area"),
    uploadedArea = document.querySelector(".upload-model__uploaded-area");

form.addEventListener("click", () => {
    fileInput.click();
});

fileInput.onchange = ({ target }) => {
    let file = target.files[0];
    if (file) {
        let fileName = file.name;
        if (fileName.length >= 16) {
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 17) + "... ." + splitName[1];
        }
        uploadFile(fileName);
    }
}

function uploadFile(name) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/upload.php");
    xhr.upload.addEventListener("progress", ({ loaded, total }) => {
        let fileLoaded = Math.floor((loaded / total) * 100);
        let fileTotal = Math.floor(total / 1000);
        let fileSize;
        (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB";
        let progressHTML = `<ul>
                              <li class="progress-area__row">
                                 <img src="/avlabs/img/icons/file.png" alt="file">
                                 <div class="progress-area__content">
                                    <div class="progress-area__details">
                                       <span class="progress-area__name">${name} ~ Uploading</span>
                                       <span class="progress-area__percent">${fileLoaded} %</span>
                                    </div>
                                    <div class="progress-area__progress-bar">
                                       <div class="progress-area__progress" style="width: ${fileLoaded}%"></div>
                                    </div>
                                 </div>
                              </li>
                           </ul>`;
        uploadedArea.classList.add("onprogress");
        progressArea.innerHTML = progressHTML;
        if (loaded == total) {
            progressArea.innerHTML = "";
            let uploadedHTML = `<ul>
                              <li class="uploaded-area__row">
                                 <img src="/avlabs/img/icons/file.png" alt="file">
                                 <div class="uploaded-area__content">
                                    <div class="uploaded-area__details">
                                       <span class="uploaded-area__name">${name} ~ Uploaded</span>
                                       <span class="uploaded-area__size">${fileSize}</span>
                                    </div>
                                 </div>
                              </li>
                           </ul>`;
            uploadedArea.classList.remove("onprogress");
            uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
        }
    });
    let data = new FormData(form);
    xhr.send(data);
}