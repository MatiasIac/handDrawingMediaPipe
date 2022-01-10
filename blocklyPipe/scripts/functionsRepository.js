let isIndexFingerExtended = function(landmarks) {
    return (landmarks[8].y < landmarks[6].y);
};

let isMiddleFingerExtended = function(landmarks) {
    return (landmarks[12].y < landmarks[10].y);
};

let isRingFingerExtended = function(landmarks) {
    return (landmarks[16].y < landmarks[14].y);
};

let isLittleFingerExtended = function(landmarks) {
    return (landmarks[20].y < landmarks[18].y);
};

let isHandExtended = function (landmarks) {
    return (landmarks[8].y < landmarks[6].y) &&
        (landmarks[12].y < landmarks[10].y) &&
        (landmarks[16].y < landmarks[14].y) && 
        (landmarks[20].y < landmarks[18].y);
}