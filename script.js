const photoInput = document.getElementById("photoInput");
const originalCanvas = document.getElementById("originalCanvas");
const finalCanvas = document.getElementById("finalCanvas");

const originalCtx = originalCanvas.getContext("2d");
const finalCtx = finalCanvas.getContext("2d");

let image = null;
let backgroundColor = "#168bd0";
let zoomValue = 1;

// ===============================
// PHOTO UPLOAD
// ===============================

photoInput.addEventListener("change", function () {

```
const file = this.files[0];

if (!file) {
    return;
}

if (!file.type.startsWith("image/")) {
    alert("कृपया केवल फोटो चुनें।");
    return;
}

const reader = new FileReader();

reader.onload = function (event) {

    image = new Image();

    image.onload = function () {

        drawOriginalPhoto();
        createFinalPhoto();

    };

    image.src = event.target.result;

};

reader.readAsDataURL(file);
```

});

// ===============================
// ORIGINAL PHOTO
// ===============================

function drawOriginalPhoto() {

```
if (!image) {
    return;
}

const maxWidth = 450;
const maxHeight = 450;

let width = image.width;
let height = image.height;

const scale = Math.min(
    maxWidth / width,
    maxHeight / height,
    1
);

width = width * scale;
height = height * scale;

originalCanvas.width = width;
originalCanvas.height = height;

originalCtx.clearRect(
    0,
    0,
    originalCanvas.width,
    originalCanvas.height
);

originalCtx.drawImage(
    image,
    0,
    0,
    width,
    height
);
```

}

// ===============================
// BACKGROUND BUTTONS
// ===============================

function changeBackground(color) {

```
backgroundColor = color;

createFinalPhoto();
```

}

// ===============================
// PASSPORT SIZE
// ===============================

function getPhotoSize() {

```
const size = document.getElementById("sizeSelect").value;

if (size === "35x45") {

    return {
        width: 413,
        height: 531
    };

}

if (size === "38x51") {

    return {
        width: 450,
        height: 602
    };

}

if (size === "33x38") {

    return {
        width: 390,
        height: 449
    };

}

return {
    width: 413,
    height: 531
};
```

}

// ===============================
// CREATE FINAL PHOTO
// ===============================

function createFinalPhoto() {

```
if (!image) {
    return;
}

const size = getPhotoSize();

finalCanvas.width = size.width;
finalCanvas.height = size.height;


// Background

finalCtx.fillStyle = backgroundColor;

finalCtx.fillRect(
    0,
    0,
    size.width,
    size.height
);


// Brightness

const brightness =
    document.getElementById("brightness").value;


// Zoom

zoomValue =
    document.getElementById("zoom").value / 100;


finalCtx.filter =
    "brightness(" + brightness + "%)";


// Image ratio

const imageRatio =
    image.width / image.height;

const canvasRatio =
    size.width / size.height;


let drawWidth;
let drawHeight;


if (imageRatio > canvasRatio) {

    drawHeight =
        size.height * zoomValue;

    drawWidth =
        drawHeight * imageRatio;

} else {

    drawWidth =
        size.width * zoomValue;

    drawHeight =
        drawWidth / imageRatio;

}


// Center image

const x =
    (size.width - drawWidth) / 2;

const y =
    (size.height - drawHeight) / 2;


// IMPORTANT:
// Original photo pixels are used.
// No AI face regeneration.

finalCtx.drawImage(
    image,
    x,
    y,
    drawWidth,
    drawHeight
);


finalCtx.filter = "none";
```

}

// ===============================
// BRIGHTNESS
// ===============================

document
.getElementById("brightness")
.addEventListener("input", function () {

```
    createFinalPhoto();

});
```

// ===============================
// ZOOM
// ===============================

document
.getElementById("zoom")
.addEventListener("input", function () {

```
    createFinalPhoto();

});
```

// ===============================
// SIZE CHANGE
// ===============================

document
.getElementById("sizeSelect")
.addEventListener("change", function () {

```
    createFinalPhoto();

});
```

// ===============================
// DOWNLOAD PHOTO
// ===============================

function downloadPhoto() {

```
if (!image) {

    alert("पहले फोटो अपलोड करें।");

    return;
}


const link =
    document.createElement("a");


link.download =
    "passport-photo.jpg";


link.href =
    finalCanvas.toDataURL(
        "image/jpeg",
        0.95
    );


link.click();
```

}

// ===============================
// PRINT PHOTO
// ===============================

function printPhoto() {

```
if (!image) {

    alert("पहले फोटो अपलोड करें।");

    return;
}


const photo =
    finalCanvas.toDataURL("image/png");


const printWindow =
    window.open("", "_blank");


if (!printWindow) {

    alert(
        "Print window खुल नहीं सकी। Browser में popup allow करें।"
    );

    return;
}


printWindow.document.write(`

    <!DOCTYPE html>

    <html>

    <head>

        <title>
            Passport Photo
        </title>

        <style>

            body {
                margin: 0;
                text-align: center;
            }

            img {
                max-width: 90%;
                margin-top: 20px;
            }

            @media print {

                img {
                    width: 35mm;
                    height: 45mm;
                }

            }

        </style>

    </head>

    <body>

        <img src="${photo}">

    </body>

    </html>

`);


printWindow.document.close();


printWindow.focus();


setTimeout(function () {

    printWindow.print();

}, 500);
```

}
