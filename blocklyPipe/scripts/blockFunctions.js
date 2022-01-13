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
            "nextStatement": null,
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

Blockly.Blocks['ai_writeoncanvas'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_writeoncanvas",
            "message0": "Output the value of %1 to the view. %2 X: %3 Y: %4",
            "args0": [
              {
                "type": "input_value",
                "name": "TEXT",
                "check": "String"
              },
              {
                "type": "input_dummy"
              },
              {
                "type": "field_variable",
                "name": "X_VAR",
                "variable": "finger_x"
              },
              {
                "type": "field_variable",
                "name": "Y_VAR",
                "variable": "finger_y"
              },
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};

Blockly.JavaScript['ai_writeoncanvas'] = function(block) {
    var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
    var variable_x_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('X_VAR'), Blockly.Variables.NAME_TYPE);
    var variable_y_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('Y_VAR'), Blockly.Variables.NAME_TYPE);
  
    var code = `ctx.fillText(${value_text},${variable_x_var}, ${variable_y_var});\n`;
    return code;
};

Blockly.Blocks['ai_showhandskeleton'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_showhandskeleton",
            "message0": "Display hand connections with color %1",
            "args0": [
              {
                "type": "field_colour",
                "name": "COLOR",
                "colour": "#ff0000"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 195,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};

Blockly.JavaScript['ai_showhandskeleton'] = function(block) {
    var colour_color = block.getFieldValue('COLOR');
    var code = `drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '${colour_color}', lineWidth: 5});\n`;
    return code;
};

Blockly.Blocks['ai_showhandlandmarks'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_showhandlandmarks",
            "message0": "Display hand landmarks with color %1",
            "args0": [
              {
                "type": "field_colour",
                "name": "COLOR",
                "colour": "#ff0000"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 195,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};

Blockly.JavaScript['ai_showhandlandmarks'] = function(block) {
    var colour_color = block.getFieldValue('COLOR');
    var code = `drawLandmarks(ctx, landmarks, {color: '${colour_color}', lineWidth: 2});\n`;
    return code;
};

Blockly.Blocks['ai_setcontextcolor'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_setcontextcolor",
            "message0": "Set drawing color to %1",
            "args0": [
              {
                "type": "field_colour",
                "name": "COLOR",
                "colour": "#ff0000"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 195,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};

Blockly.JavaScript['ai_setcontextcolor'] = function(block) {
    var colour_color = block.getFieldValue('COLOR');
    var code = `ctx.fillStyle = '${colour_color}';\n`;
    return code;
};

Blockly.Blocks['ai_fontsize'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_fontsize",
            "message0": "Set text size to %1 px",
            "args0": [
              {
                "type": "field_number",
                "name": "SIZE",
                "value": 10,
                "min": 0,
                "max": 80,
                "precision": 1
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};

Blockly.JavaScript['ai_fontsize'] = function(block) {
    var number_size = block.getFieldValue('SIZE');
    var code = `ctx.font = "${number_size}px Arial";\n`;
    return code;
};

Blockly.Blocks['ai_getcoord'] = {
    init: function () {
        this.jsonInit({
            "type": "ai_getcoord",
            "message0": "Save X value into %1 and save Y value into %2 from finger joint %3",
            "args0": [
              {
                "type": "field_variable",
                "name": "X_VAR",
                "variable": "finger_x"
              },
              {
                "type": "field_variable",
                "name": "Y_VAR",
                "variable": "finger_y"
              },
              {
                "type": "field_dropdown",
                "name": "finger_joint",
                "options": [
                  [
                    "0",
                    "0"
                  ],
                  [
                    "1",
                    "1"
                  ],
                  [
                    "2",
                    "2"
                  ],
                  [
                    "3",
                    "3"
                  ],
                  [
                    "4",
                    "4"
                  ],
                  [
                    "5",
                    "5"
                  ],
                  [
                    "6",
                    "6"
                  ],
                  [
                    "7",
                    "7"
                  ],
                  [
                    "8",
                    "8"
                  ],
                  [
                    "9",
                    "9"
                  ],
                  [
                    "10",
                    "10"
                  ],
                  [
                    "11",
                    "11"
                  ],
                  [
                    "12",
                    "12"
                  ],
                  [
                    "13",
                    "13"
                  ],
                  [
                    "14",
                    "14"
                  ],
                  [
                    "15",
                    "15"
                  ],
                  [
                    "16",
                    "16"
                  ],
                  [
                    "17",
                    "17"
                  ],
                  [
                    "18",
                    "18"
                  ],
                  [
                    "19",
                    "19"
                  ],
                  [
                    "20",
                    "20"
                  ]
                ]
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 180,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};

Blockly.JavaScript['ai_getcoord'] = function(block) {
    var variable_x_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('X_VAR'), Blockly.Variables.NAME_TYPE);
    var variable_y_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('Y_VAR'), Blockly.Variables.NAME_TYPE);
    var dropdown_finger_joint = block.getFieldValue('finger_joint');
    
    var code = `${variable_x_var} = landmarks[${dropdown_finger_joint}].x;\n`;
    code += `${variable_y_var} = landmarks[${dropdown_finger_joint}].y;\n`;
    
    return code;
};