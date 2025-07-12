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
        var code = Blockly.JavaScript.workspaceToCode(this.workspace);
        var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);

        //get the code and push it to the renderer
        console.log(code);
        console.log(xmlText);

        code = `try { ${code} } catch(e) { console.log(e); } `;
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
        
        Blockly.JavaScript.init(this.workspace);
    };

    w.handler = new handler();

}(window, jQuery));