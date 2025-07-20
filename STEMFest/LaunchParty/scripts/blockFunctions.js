Blockly.Blocks['game_gavity'] = {
    init: function () {
        this.jsonInit({
            "type": "game_gravity",
            "tooltip": "Defines the general gravity of the game",
            "helpUrl": "",
            "message0": "Set world gravity to %1 %2",
            "args0": [
                {
                "type": "field_number",
                "name": "GRAVITY",
                "value": 40,
                "min": 0,
                "max": 5000,
                "precision": 1
                },
                {
                "type": "input_dummy",
                "name": "NAME"
                }
            ],
            "colour": 225
            });
    }
};

Blockly.JavaScript['game_gavity'] = function (block) {
    const text_gravity = block.getFieldValue('GRAVITY');
    const code = `frame1.GRAVITY = ${text_gravity};`;
    return code;
};

Blockly.Blocks['game_coins'] = {
    init: function () {
        this.jsonInit({
            "type": "game_coins",
            "tooltip": "Defines the number of simultaneous enemies in the world",
            "helpUrl": "",
            "message0": "Set world coins to %1 %2",
            "args0": [
                {
                "type": "field_number",
                "name": "MAXCOINS",
                "value": 5,
                "min": 1,
                "max": 20,
                "precision": 1
                },
                {
                "type": "input_dummy",
                "name": "NAME"
                }
            ],
            "colour": 200
            });
    }
};

Blockly.JavaScript['game_coins'] = function (block) {
    const text_coins = block.getFieldValue('MAXCOINS');
    const code = `frame1.MAXCOINS = ${text_coins};`;
    return code;
};

Blockly.Blocks['game_enemies'] = {
    init: function () {
        this.jsonInit({
            "type": "game_enemies",
            "tooltip": "Defines the number of simultaneous enemies in the world",
            "helpUrl": "",
            "message0": "Set world enemies to %1 %2",
            "args0": [
                {
                "type": "field_number",
                "name": "TOTALENEMIES",
                "value": 5,
                "min": 1,
                "max": 50,
                "precision": 1
                },
                {
                "type": "input_dummy",
                "name": "NAME"
                }
            ],
            "colour": 125
            });
    }
};

Blockly.JavaScript['game_enemies'] = function (block) {
    const text_enemies = block.getFieldValue('TOTALENEMIES');
    const code = `frame1.TOTALENEMIES = ${text_enemies};`;
    return code;
};

Blockly.Blocks['game_reloadspeed'] = {
    init: function () {
        this.jsonInit({
            "type": "game_reloadspeed",
            "tooltip": "Defines the shuriken reload speed",
            "helpUrl": "",
            "message0": "Set world reload speed to %1 %2",
            "args0": [
                {
                "type": "field_number",
                "name": "SHURIKENRELOADSPEED",
                "value": 0.001,
                "min": 0.001,
                "max": 0.05,
                "precision": 0.001
                },
                {
                "type": "input_dummy",
                "name": "NAME"
                }
            ],
            "colour": 145
        });
    }
};

Blockly.JavaScript['game_reloadspeed'] = function (block) {
    const text_reloadSpeed = block.getFieldValue('SHURIKENRELOADSPEED');
    const code = `frame1.player.reloadSpeed = ${text_reloadSpeed};`;
    return code;
};