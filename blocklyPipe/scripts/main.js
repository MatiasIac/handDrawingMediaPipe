(function (w, $) {

    var handler = function () {
        this._setBlockly();
        this._attachEvents();
    };

    handler.prototype._attachEvents = function () {
        var self = this;

        $('#startButton').on('click', function () {
            self._run();
        });
    };

    handler.prototype._run = function () {
        var self = this;

        var code = Blockly.JavaScript.workspaceToCode(this.workspace);
        var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);

        //get the code and push it to the renderer
        console.log(code);

        code = `window.actionFunction = function(landmarks, ctx) { ${code} };`;
        eval(code);
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

}(window, jQuery));

window.actionFunction = function(landmarks) { };

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const ctx = canvasElement.getContext('2d');
const messageContainer = document.getElementById('usermessage');

function onResults(results) {
    ctx.save();
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        //drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
        //drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});

        window.actionFunction(landmarks, ctx);
      }
    }

    ctx.restore();
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