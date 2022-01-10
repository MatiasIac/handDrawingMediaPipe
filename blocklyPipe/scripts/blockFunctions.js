Blockly.Blocks['ai_isIndexExtendend'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_isIndexExtendend",
            "lastDummyAlign0": "CENTRE",
            "message0": "Is Index Finger Extended?",
            "output": "Boolean",
            "colour": 75,
            "tooltip": "Is Index Finger Extended?",
            "helpUrl": "",
        });
    }
};

Blockly.JavaScript['ai_isIndexExtendend'] = function (block) {
    return ['isIndexFingerExtended(landmarks)', Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['ai_isMiddleExtendend'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_isMiddleExtendend",
            "lastDummyAlign0": "CENTRE",
            "message0": "Is Middle Finger Extended?",
            "output": "Boolean",
            "colour": 75,
            "tooltip": "Is Middle Finger Extended?",
            "helpUrl": "",
        });
    }
};

Blockly.JavaScript['ai_isMiddleExtendend'] = function (block) {
    return ['isMiddleFingerExtended(landmarks)', Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['ai_isRingExtendend'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_isRingExtendend",
            "lastDummyAlign0": "CENTRE",
            "message0": "Is Ring Finger Extended?",
            "output": "Boolean",
            "colour": 75,
            "tooltip": "Is Ring Finger Extended?",
            "helpUrl": "",
        });
    }
};

Blockly.JavaScript['ai_isRingExtendend'] = function (block) {
    return ['isRingFingerExtended(landmarks)', Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['ai_isLittleExtendend'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_isLittleExtendend",
            "lastDummyAlign0": "CENTRE",
            "message0": "Is Little Finger Extended?",
            "output": "Boolean",
            "colour": 75,
            "tooltip": "Is Little Finger Extended?",
            "helpUrl": "",
        });
    }
};

Blockly.JavaScript['ai_isLittleExtendend'] = function (block) {
    return ['isLittleFingerExtended(landmarks)', Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['ai_isHandOpen'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_isHandOpen",
            "lastDummyAlign0": "CENTRE",
            "message0": "Is Hand Open?",
            "output": "Boolean",
            "colour": 75,
            "tooltip": "Is Hand Open?",
            "helpUrl": "",
        });
    }
};

Blockly.JavaScript['ai_isHandOpen'] = function (block) {
    return ['isHandExtended(landmarks)', Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['ai_consoleout'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_consoleout",
            "message0": "Output the value of %1 to the console",
            "args0": [
                {
                    "type": "input_value",
                    "name": "NAME",
                    "check": [
                        "Boolean",
                        "Number",
                        "String"
                    ]
                }
            ],
            "previousStatement": null,
            "colour": 330,
            "tooltip": "Output the value of %1 to the console",
            "helpUrl": ""
        });
    }
};

Blockly.JavaScript['ai_consoleout'] = function (block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `console.log(${value_name});\n`;
    return code;
};