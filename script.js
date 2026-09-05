// ==========================================
// SMART PASSPORT PHOTO MAKER
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const photoInput = document.getElementById("photoInput");
    const originalCanvas = document.getElementById("originalCanvas");
    const finalCanvas = document.getElementById("finalCanvas");

    const originalCtx = originalCanvas.getContext("2d");
    const finalCtx = finalCanvas.getContext("2d");

    const brightnessControl = document.getElementById("brightness");
    const zoomControl = document.getElementById("zoom");
    const sizeSelect = document.getElementById("sizeSelect");

    let image = new Image();
    let photoLoaded = false;
    let backgroundColor = "#168bd0";


    // ==========================================
    // PHOTO UPLOAD
    // ==========================================

    photoInput.addEventListener("change", function (event) {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        // Check image
        if (!file.type.startsWith("image/")) {
            alert("कृपया JPG, PNG या WEBP फोटो चुनें।");
            return;
        }

        // Check file size - maximum 20 MB
        if (file.size > 20 * 1024 * 1024) {
            alert("फोटो का आकार 20 MB से कम होना चाहिए।");
            return;
        }

        // Create temporary URL
        const imageURL = URL.createObjectURL(file);

        image = new Image();

        image.onload = function () {

            photoLoaded = true;

            // Show original photo
            drawOriginalPhoto();

            // Create final photo
            createFinalPhoto();

            // Release memory
            URL.revokeObjectURL(imageURL);

        };

        image.onerror = function () {

            photoLoaded = false;

            alert("फोटो लोड नहीं हो सकी। कृपया दूसरी JPG/PNG फोटो चुनें।");

            URL.revokeObjectURL(imageURL);
        };

        image.src = imageURL;

    });


    // ==========================================
    // DRAW ORIGINAL PHOTO
    // ==========================================

    function drawOriginalPhoto() {

        if (!photoLoaded) {
            return;
        }

        const maxWidth = 450;
        const maxHeight = 450;

        let width = image.naturalWidth;
        let height = image.naturalHeight;

        const scale = Math.min(
            maxWidth / width,
            maxHeight / height,
            1
        );

        width = Math.round(width * scale);
        height = Math.round(height * scale);

        originalCanvas.width = width;
        originalCanvas.height = height;

        originalCtx.clearRect(
            0,
            0,
            width,
            height
        );

        originalCtx.drawImage(
            image,
            0,
            0,
            width,
            height
        );
    }


    // ==========================================
    // CHANGE BACKGROUND
    // ==========================================

    window.changeBackground = function (color) {

        backgroundColor = color;

        createFinalPhoto();
    };


    // ==========================================
    // PHOTO SIZE
    // ==========================================

    function getPhotoSize() {

        const selectedSize = sizeSelect.value;

        // 3.5 × 4.5 cm
        if (selectedSize === "35x45") {
            return {
                width: 413,
                height: 531
            };
        }

        // 1.5 × 2 inch
        if (selectedSize === "38x51") {
            return {
                width: 450,
                height: 602
            };
        }

        // 1.3 × 1.5 inch
        if (selectedSize === "33x38") {
            return {
                width: 390,
                height: 449
            };
        }

        return {
            width: 413,
            height: 531
        };
    }


    // ==========================================
    // CREATE FINAL PHOTO
    // ==========================================

    function createFinalPhoto() {

        if (!photoLoaded) {
            return;
        }

        const size = getPhotoSize();

        finalCanvas.width = size.width;
        finalCanvas.height = size.height;


        // --------------------------------------
        // Background
        // --------------------------------------

        finalCtx.filter = "none";

        finalCtx.fillStyle = backgroundColor;

        finalCtx.fillRect(
            0,
            0,
            size.width,
            size.height
        );


        // --------------------------------------
        // Brightness
        // --------------------------------------

        const brightness =
            Number(brightnessControl.value);


        // --------------------------------------
        // Zoom
        // --------------------------------------

        const zoom =
            Number(zoomControl.value) / 100;


        finalCtx.filter =
            "brightness(" + brightness + "%)";


        // --------------------------------------
        // Calculate image size
        // --------------------------------------

        const imageWidth = image.naturalWidth;
        const imageHeight = image.naturalHeight;

        const imageRatio =
            imageWidth / imageHeight;

        const canvasRatio =
            size.width / size.height;

        let drawWidth;
        let drawHeight;


        if (imageRatio > canvasRatio) {

            // Image is wider

            drawHeight =
                size.height * zoom;

            drawWidth =
                drawHeight * imageRatio;

        } else {

            // Image is taller

            drawWidth =
                size.width * zoom;

            drawHeight =
                drawWidth / imageRatio;
        }


        // --------------------------------------
        // Center image
        // --------------------------------------

        const x =
            (size.width - drawWidth) / 2;

        const y =
            (size.height - drawHeight) / 2;


        // --------------------------------------
        // Draw original pixels
        // --------------------------------------

        finalCtx.drawImage(
            image,
            x,
            y,
            drawWidth,
            drawHeight
        );


        // Reset filter
        finalCtx.filter = "none";

    }


    // ==========================================
    // BRIGHTNESS
    // ==========================================

    brightnessControl.addEventListener(
        "input",
        function () {

            createFinalPhoto();

        }
    );


    // ==========================================
    // ZOOM
    // ==========================================

    zoomControl.addEventListener(
        "input",
        function () {

            createFinalPhoto();

        }
    );


    // ==========================================
    // SIZE
    // ==========================================

    sizeSelect.addEventListener(
        "change",
        function () {

            createFinalPhoto();

        }
    );


    // ==========================================
    // DOWNLOAD
    // ==========================================

    window.downloadPhoto = function () {

        if (!photoLoaded) {

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

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };


    // ==========================================
    // PRINT
    // ==========================================

    window.printPhoto = function () {

        if (!photoLoaded) {

            alert("पहले फोटो अपलोड करें।");

            return;
        }

        const photo =
            finalCanvas.toDataURL("image/png");

        const printWindow =
            window.open("", "_blank");

        if (!printWindow) {

            alert(
                "Print window नहीं खुल सकी। कृपया browser में popup allow करें।"
            );

            return;
        }


        printWindow.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>Passport Photo</title>

                <style>

                    body {
                        margin: 0;
                        padding: 20px;
                        text-align: center;
                        background: white;
                    }

                    img {
                        width: 35mm;
                        height: 45mm;
                        object-fit: cover;
                    }

                    @media print {

                        body {
                            padding: 0;
                        }

                        img {
                            width: 35mm;
                            height: 45mm;
                        }

                    }

                </style>

            </head>

            <body>

                <img src="${photo}">

                <script>

                    window.onload = function () {
                        window.print();
                    };

                <\/script>

            </body>

            </html>

        `);

        printWindow.document.close();

    };


    // ==========================================
    // INITIAL STATE
    // ==========================================

    originalCtx.clearRect(
        0,
        0,
        originalCanvas.width,
        originalCanvas.height
    );

    finalCtx.clearRect(
        0,
        0,
        finalCanvas.width,
        finalCanvas.height
    );

});
