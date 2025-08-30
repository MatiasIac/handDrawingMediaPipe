var gameController = {
    points: 0,

    id: "gameController",
    visible: false,

    currentQuestion: null,

    init: function () {
        var self = this;

        jsGFwk.Sprites.coin.reset();

        jsGFwk.ResourceManager.sounds.music.audio.pause();
        jsGFwk.ResourceManager.sounds.music.audio.play();

        this._enemySpawnTimer = new jsGFwk.Timer({
            action: function () {
                if (enemyContainer.length() < TOTALENEMIES) enemyContainer.cloneObject();
            }, tickTime: 0.5
        });

        this._coinsAnimationTimer = new jsGFwk.Timer({ action: function () { jsGFwk.Sprites.coin.next(); }, tickTime: 0.1 });

        this._coinsRespawner = new jsGFwk.Timer({ action: function () { if (coinContainer.length() === 0) gameController._dropCoins(); }, tickTime: 2 });

        this.points = 0;
        this._dropCoins();
    },

    _getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    _getCoin: function () {
        this.points += 10;
        coinJuke.play();
    },

    _lostPoints: function () {
        this.points -= 5;
        this.points = Math.max(this.points, 0);
        hurtJuke.play();
    },

    _pointsByKill: function () {
        this.points +=5;
    },

    _dropCoins: function () {
        coinContainer.clearAll();
        for (var i = 0; i < MAXCOINS; i++) {
            coinContainer.cloneObject();
        }
    },

    update: function (delta) {
        this._enemySpawnTimer.tick(delta);
        this._coinsAnimationTimer.tick(delta);
        this._coinsRespawner.tick(delta);
    }
};

var enemy = {
    //added to calculate collision
    width: 20,
    height: 20,
    x: 0,
    y: 0,
    //****/

    physics: null,

    spriteIndex: 0,
    sprite: null,

    animationAccumulator: 0,

    _initializationTimer: null,
    _jumpingTimer: null,

    _updateAnimation: function (delta) {
        this.animationAccumulator += delta;

        if (this.animationAccumulator > 0.2) {
            this.spriteIndex++;
            this.spriteIndex = this.spriteIndex % 2;

            this.sprite = this.physics.right ? 
                jsGFwk.Sprites.enemyRight.spriteBag[this.spriteIndex].image : 
                jsGFwk.Sprites.enemyLeft.spriteBag[this.spriteIndex].image;
            
            this.animationAccumulator = 0;
        }
    },

    _initializationBehavior: function (delta) {
        this._updateAnimation(delta);
        this.physics.update(delta);
        this._initializationTimer.tick(delta);
    },

    _fallFromPlatform: function () {
        return Math.random() > 0.8;
    },

    _normalBehavior: function (delta) {
        this._updateAnimation(delta);
        this._jumpingTimer.tick(delta);
        this.physics.update(delta);

        this.x = this.physics.x;
        this.y = this.physics.y;

        if (!this.physics.falling) {
            if (this.physics.atMaxLeft) {
                if (this._fallFromPlatform()) {
                    this.physics.left = false;
                    this.physics.right = true;
                }
            } else if (this.physics.atMaxRight) {
                if (this._fallFromPlatform()) {
                    this.physics.left = true;
                    this.physics.right = false;
                }
            }
        }

        if (jsGFwk.Collisions.areCollidingBy(this, player, 0)) {
            player.getHit();
        }

        //just in case physics failed and get out of the screen
        if (this.physics.x < 0 || this.physics.x > game.configurations.width) this.destroy();
        if (this.physics.y < 0 || this.physics.y > game.configurations.height) this.destroy();

        //baseline and touch any of the doors
        if (this.physics.y === ENEMY_DEAD_Y_LINE && (this.physics.x === TILE || this.physics.x + TILE === game.configurations.width - TILE)) this.destroy();
    },

    init: function(params) {
        var self = this;

        //randomly set physic properties
        this.physics = new physics();
        this.physics.accel = parseInt(Math.random() * 200) + 30;
        this.physics.x = (parseInt(Math.random() * (MAP.tw - 2)) * TILE) + TILE;
        this.physics.impulse = parseInt(Math.random() * 6000) + 21000;
        
        this.sprite = jsGFwk.Sprites.enemyRight.spriteBag[this.spriteIndex].image;

        this._initializationTimer = new jsGFwk.Timer({
            action: function () {
                self.update = self._normalBehavior;
                self.physics.right = true;
            },
            tickTime: 0.5
        });

        this._jumpingTimer = new jsGFwk.Timer({
            action: function () {
                self.physics.jump = Math.random() > 0.8;
            },
            tickTime: 1.5
        });

        this.update = this._initializationBehavior;
    },

    update: function(delta) { },
    draw: function (ctx) {
        ctx.drawImage(this.sprite, this.physics.x, this.physics.y);
    }
};

var shuriken = {
    width: 20,
    height: 20,

    init: function (parameters) {
        this.x = parameters.x;
        this.y = parameters.y;
        this.image = jsGFwk.Sprites.shuriken.spriteBag[0].image;
        this.speed = 4.5 * parameters.direction;
        this.direction = parameters.direction;
        this.spriteIndex = 0;
        this.animationAccumulator = 0;
    },

    _destroyObject: function () {

        for (var i = 0; i < 2; i++) {
            particlesContainer.cloneObject({ 
                x: this.x + TILE / 2, 
                y: this.y + TILE / 2,
                color: { r: 100, g: 100, b: 100 }
            });
        }

        this.destroy();
    },

    update: function (delta) {
        var self = this;
        this.x += this.speed;

        this.animationAccumulator += delta;

        if (this.animationAccumulator > 0.05) {
            this.spriteIndex++;
            this.spriteIndex = this.spriteIndex % 2;
            this.animationAccumulator = 0;
            this.image = jsGFwk.Sprites.shuriken.spriteBag[this.spriteIndex].image;
        }

        var targetCellLeft = cell(this.x, this.y) !== 0;
        var targetCellRigh = this.direction === 1 && cell(this.x + TILE, this.y) !== 0;

        if (targetCellLeft || targetCellRigh) this._destroyObject();
        if (this.x - TILE <= 0 || this.x + TILE > game.configurations.width - TILE) this._destroyObject();

        enemyContainer.eachCloned(function (enemy, cancellation) {
            if (jsGFwk.Collisions.areCollidingBy(self, enemy, 0)) {
                cancellation.cancel = true;
                gameController._pointsByKill();

                hurtJuke.play();
                
                for (var i = 0; i < 30; i++) {
                    particlesContainer.cloneObject({ x: enemy.x, y: enemy.y, color: getJollyColor() });
                }

                enemy.destroy();
                
                self._destroyObject();
            }
        });
    },
    draw: function (ctx) {
        ctx.drawImage(this.image, this.x, this.y);
    }
};

var coin = {
    x: 0,
    y: 0,
    width: TILE,
    height: TILE,

    physics: null,

    init: function(parameters) {
        this.physics = new physics();
        this.physics.x = (parseInt(Math.random() * (MAP.tw - 2)) * TILE) + TILE;
        this.physics.y = (parseInt(Math.random() * (MAP.th - 2)) * TILE) + TILE;
    },

    update: function (delta) {
        this.physics.update(delta);
        this.x = this.physics.x;
        this.y = this.physics.y;

        if (jsGFwk.Collisions.areCollidingBy(this, player, 0)) {
            gameController._getCoin();
            this.destroy();
            return;
        }

        if (this.x <= 0 || this.x >= game.configurations.width - TILE) this.destroy();
        if (this.y <= 0 || this.y >= game.configurations.height) this.destroy();
    },

    draw: function (ctx) {
        ctx.drawImage(jsGFwk.Sprites.coin.sprite.image, this.x, this.y);
    }
};

var clock = {
    id: "clock",
    visible: false,
    time: 5,
    timeTimer: null,

    clockSize: 10,
    clockX: 0,
    clockY: 0,

    init: function () {
        var self = this;

        this.time = 5;
        this.timeTimer = new jsGFwk.Timer({action: function () { self.time--; }, tickTime: 1});
    },

    update: function (delta) {
        if (!this.visible) {
            this.timeTimer.reset();
            return;
        }

        this.timeTimer.tick(delta);
    },

    draw: function(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "red";

        ctx.moveTo(this.clockX, this.clockY);
        ctx.arc(this.clockX, this.clockY, this.clockSize, 1.5 * Math.PI, 3.5 * Math.PI);
        ctx.lineTo(this.clockX, this.clockY);

        ctx.stroke();
        ctx.fill();
    }
};