const video = document.getElementById("video");

// const loadFaceAPI = async () => {
//     await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
//     await faceapi.nets.faceRecognitionNet.loadFromUri('./models');
//     await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
//     await faceapi.nets.faceExpressionNet.loadFromUri('./models');
// };

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(getVideo);

function getVideo() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: {} }).then(
            stream => {
                video.srcObject = stream;
            });
    }
};

video.addEventListener('playing', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.querySelector(".container").append(canvas);

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    // console.log("video: ", displaySize)

    setInterval(async () => {
        const detect = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        // .withFaceLandmarks()
        // .withFaceDescriptors()
        // .withAgeAndGender()
        .withFaceExpressions();
        console.log("detect: ", detect);
        const resizedDetections = faceapi.resizeResults(detect, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        faceapi.draw.drawDetections(canvas, resizedDetections);
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 1000);
});