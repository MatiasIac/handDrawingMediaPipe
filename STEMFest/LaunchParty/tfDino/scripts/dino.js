const dino = {
    id: 10,
    name: 'rex',
    isVisible: true,
    x: 10,
    y: FLOOR_Y - 44,
    floor_limit: FLOOR_Y - 44,
    animSpeed: 0,
    topJump: 60,
    jumpSpeed: 2.5,
    fallingSpeed: 1.5,
    dieSpeed: 0,

    CURRENT_STATE: { },

    sprite: {},

    STATES: {
        'IDLE': {
            _name: "IDLE",
            update: function() { 
                if (this.animSpeed > 0.5) {
                    this.animSpeed = 0;
                    sprites.SPRITES_BAG.idle.moveNextSprite();
                }
                this.sprite = sprites.SPRITES_BAG.idle.sprite.image;
            }
        },
        'RUNNING': {
            _name: "RUNNING",
            _boundingBox: {
                height: 25,
                width: 10,
                x: 25,
                y: FLOOR_Y - 35
            },
            update: function(delta) {
                if (this.animSpeed > 0.1) {
                    this.animSpeed = 0;
                    sprites.SPRITES_BAG.running.moveNextSprite();
                }
                this.sprite = sprites.SPRITES_BAG.running.sprite.image;
            }
        },
        'DUCKING': {
            _name: "DUCKING",
            _boundingBox: {
                height: 10,
                width: 30,
                x: 25,
                y: FLOOR_Y - 20
            },
            update: function(delta) {
                if (this.animSpeed > 0.1) {
                    this.animSpeed = 0;
                    sprites.SPRITES_BAG.ducking.moveNextSprite();
                }

                this.sprite = sprites.SPRITES_BAG.ducking.sprite.image;
            }
        },
        'JUMPING': {
            _name: "JUMPING",
            _boundingBox: {
                height: 25,
                width: 10,
                x: 25,
                y: FLOOR_Y - 35
            },
            update: function(delta, that) {
                this.sprite = sprites.SPRITES_BAG.running.sprite.image;

                this.y -= this.jumpSpeed;
                that._boundingBox.y = this.y + 10;

                if (this.y <= this.floor_limit - this.topJump) {
                    this.STATES.FALLING._boundingBox.y = this.y;
                    this.CURRENT_STATE = this.STATES.FALLING;
                }
            }
        },
        'FALLING': {
            _name: "FALLING",
            _boundingBox: {
                height: 25,
                width: 10,
                x: 25,
                y: FLOOR_Y - 35
            },
            update: function(delta, that) { 
                this.sprite = sprites.SPRITES_BAG.running.sprite.image;

                this.y += this.fallingSpeed;
                that._boundingBox.y = this.y + 10;

                if (this.y >= this.floor_limit) {
                    this.CURRENT_STATE = this.STATES.RUNNING;
                    this.y = this.floor_limit;
                    IS_IDLE = false;
                }
            }
        },
        'DYING': {
            _name: "DYING",
            update: function(delta) {
                IS_DEAD = true;
                IS_IDLE = true;

                this.dieSpeed += delta;
                this.sprite = sprites.SPRITES_BAG.die.sprite.image;

                if (this.dieSpeed > 0.5) {
                    this.dieSpeed = 0;
                    sprites.SPRITES_BAG.die.moveNextSprite();
                }

                if (sprites.SPRITES_BAG.die.seeker >= 1) {
                    sprites.SPRITES_BAG.die.reset();

                    IS_DEAD = false;
                    
                    this.CURRENT_STATE = this.STATES.IDLE;

                    if (HIGH_SCORE < SCORE) {
                        HIGH_SCORE = SCORE;
                    }

                    SCORE = 0;
                }
            }
        }
    },
 
    init: function() {
        this.sprite = sprites.SPRITES_BAG.running.sprite;
        this.CURRENT_STATE = this.STATES.IDLE;
    },
 
    update: function(delta) {
        this.animSpeed += delta;

        if (!IS_DEAD) {

            if ((keyboardIO.getActiveKeys()[jsGFwk.KeyboardIO.KEYS.W] === true || CV_ACTION === 'Two') && this.CURRENT_STATE._name === "IDLE") { 
                this.CURRENT_STATE = this.STATES.JUMPING;
            }

            if ((keyboardIO.getActiveKeys()[jsGFwk.KeyboardIO.KEYS.W] === true || CV_ACTION === 'Two') && 
                (this.CURRENT_STATE._name === "RUNNING" || this.CURRENT_STATE._name === "DUCKING")) { 
                this.CURRENT_STATE = this.STATES.JUMPING;
            }

            if (keyboardIO.getActiveKeys()[jsGFwk.KeyboardIO.KEYS.S] === true || CV_ACTION === 'None' && 
            (this.CURRENT_STATE._name === "RUNNING" || this.CURRENT_STATE._name === "DUCKING")) { 
                this.CURRENT_STATE = this.STATES.DUCKING;
            } else if (this.CURRENT_STATE._name === "DUCKING" && keyboardIO.getActiveKeys()[jsGFwk.KeyboardIO.KEYS.S] === undefined) {
                this.CURRENT_STATE = this.STATES.RUNNING;
            }

        }

        if (this.CURRENT_STATE.update) { 
            this.CURRENT_STATE.update.call(this, delta, this.CURRENT_STATE);
        }
    },
 
    draw: function(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y);

        //if (this.CURRENT_STATE._boundingBox) {
        //    ctx.strokeStyle = 'red';
        //    ctx.beginPath();
        //    ctx.rect(this.CURRENT_STATE._boundingBox.x, this.CURRENT_STATE._boundingBox.y, this.CURRENT_STATE._boundingBox.width, this.CURRENT_STATE._boundingBox.height);
        //    ctx.stroke();
        //}
    },

    triggerDeath: function () {
        this.CURRENT_STATE = this.STATES.DYING;
    }
}