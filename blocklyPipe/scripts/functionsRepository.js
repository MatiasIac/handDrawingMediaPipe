const isIndexFingerExtended = function(landmarks) {
    return (landmarks[8].y < landmarks[6].y);
};

const isMiddleFingerExtended = function(landmarks) {
    return (landmarks[12].y < landmarks[10].y);
};

const isRingFingerExtended = function(landmarks) {
    return (landmarks[16].y < landmarks[14].y);
};

const isLittleFingerExtended = function(landmarks) {
    return (landmarks[20].y < landmarks[18].y);
};

const isHandExtended = function (landmarks) {
    return (landmarks[8].y < landmarks[6].y) &&
        (landmarks[12].y < landmarks[10].y) &&
        (landmarks[16].y < landmarks[14].y) && 
        (landmarks[20].y < landmarks[18].y);
}

const clearCanvas = function() {
    ctxOverlay.clearRect(0, 0, canvasElement.width, canvasElement.height);
};

const putDotOnCanvas = function (x, y) {
    ctxOverlay.beginPath();
    ctxOverlay.arc(x, y, 10, 0, 2 * Math.PI);
    ctxOverlay.fill();
};