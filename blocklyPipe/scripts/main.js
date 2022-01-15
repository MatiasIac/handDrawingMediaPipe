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

        $('#loadScript').on('click', function () {
            const script = $('#scriptloader').val();
            self._load(script);
            self._closeLoadScriptPopup();
        });

        $('#loadButton').on('click', function () {
            self._showLoadScriptPopup();
        });

        $('#cancelScript').on('click', function () {
            self._closeLoadScriptPopup();
        });

        $('#saveButton').on('click', function () { 
            self._saveScriptToClipboard();
        });
    };

    handler.prototype._saveScriptToClipboard = function () {
        var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);

        navigator.clipboard.writeText(xmlText);
        alert("Copied to the clipboard!");
    };

    handler.prototype._closeLoadScriptPopup = function () {
        $('.gray-overlay').hide();
        $('.loader-popup').hide();
    };

    handler.prototype._showLoadScriptPopup = function () {
        $('#scriptloader').val("");
        $('.gray-overlay').show();
        $('.loader-popup').show();
    };

    handler.prototype._run = function () {
        var code = Blockly.JavaScript.workspaceToCode(this.workspace);
        var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);

        //get the code and push it to the renderer
        console.log(code);
        console.log(xmlText);

        code = `window.actionFunction = function(landmarks, ctx) { ${code} };`;
        eval(code);
    };

    handler.prototype._load = function (xml) {
        var self = this;

        try {
            var dom = Blockly.Xml.textToDom(xml);

            this.workspace.clear();

            Blockly.mainWorkspace.clear();
            Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, dom);

            setTimeout(function () {
                self.workspace.trashcan.emptyContents();
            }, 100);
        } catch (e) {
            console.log(`Didn't work - ${e}`);
        }
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
        
        Blockly.JavaScript.init(this.workspace);
    };

    w.MediaPipeHandler = new handler();

}(window, jQuery));

window.actionFunction = function(landmarks) { };

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const ctx = canvasElement.getContext('2d');
const messageContainer = document.getElementById('usermessage');

const canvasOverlay = document.createElement('canvas');
canvasOverlay.width = canvasElement.width;
canvasOverlay.height = canvasElement.height;
const ctxOverlay = canvasOverlay.getContext('2d');

function onResults(results) {
    ctx.save();
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        window.actionFunction(landmarks, ctx);
      }
    }

    ctx.restore();

    // this can be improved using a videogame pattern approach
    // by now, we only print on top what was drawn on the canvas
    ctx.drawImage(canvasOverlay, 0, 0);    
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