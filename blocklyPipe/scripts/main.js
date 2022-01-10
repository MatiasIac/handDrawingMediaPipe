Blockly.Blocks['ai_isIndexExtendend'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_isIndexExtendend",
            "lastDummyAlign0": "CENTRE",
            "message0": "Is Index Finger Up?",
            "output": "Boolean",
            "colour": 75,
            "tooltip": "Is Index Finger Up?",
            "helpUrl": "",
        });
    }
};

Blockly.JavaScript['ai_isIndexExtendend'] = function (block) {
    return 'isHandExtended(landmarks)';
};

(function (w) {

    var handler = function () {
        this._setBlockly();
        this._attachEvents();
    };

    handler.prototype._attachEvents = function () {
        var self = this;
    };

    handler.prototype._run = function () {
        var self = this;

        var code = Blockly.JavaScript.workspaceToCode(this.workspace);
        var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);

        //get the code and push it to the renderer
    };

    handler.prototype._setBlockly = function () {
        this.workspace = Blockly.inject('blocklyDiv', {
            toolbox: document.getElementById('toolbox'),
            grid: {
                spacing: 20,
                length: 3,
                colour: '#ccc',
                snap: true
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
                pinch: true
            },
            trashcan: true
        });
    };

    w.MediaPipeHandler = new handler();

}(window));

let isFingerPointing = function(landmarks) {
    return (landmarks[8].y < landmarks[6].y) &&
        (landmarks[12].y > landmarks[10].y) &&
        (landmarks[16].y > landmarks[14].y) && 
        (landmarks[20].y > landmarks[18].y);
};

let isHandExtended = function (landmarks) {
    return (landmarks[8].y < landmarks[6].y) &&
        (landmarks[12].y < landmarks[10].y) &&
        (landmarks[16].y < landmarks[14].y) && 
        (landmarks[20].y < landmarks[18].y);
}

let actionFunction = function(landmarks) {
};

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const messageContainer = document.getElementById('usermessage');

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
        //drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});

        actionFunction(landmarks);
      }
    }

    canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({image: videoElement});
    },
    width: 640,
    height: 480
});

camera.start();