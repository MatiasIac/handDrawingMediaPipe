var player = {
    /* added for collition detection */
    x: 0,
    y: 0,
    width: TILE,
    height: TILE,
    /****** */

    id: "player",
    visible: true,

    lookingAt: true,
    animAccumulator: 0,

    physics: null,
    maxJumpImpulse: 27000,

    firingTrigger: 0.5,

    shurikens: 3,
    reloadSpeed: 0.01,

    isInvinsible: false,
    image: null,
    emptyImage: new Image(),

    init: function() {
        var self = this;

        jsGFwk.Sprites.playerRight.reset();
        jsGFwk.Sprites.playerLeft.reset();

        this.image = jsGFwk.Sprites.playerRight.spriteBag[0].image;
        this.isInvinsible = false;
        this.shurikens = 3;

        this.physics = new physics();
        this.physics.impulse = this.maxJumpImpulse;
        this.physics.x = 10 + TILE;
        this.physics.y = game.configurations.height - (TILE * 2);

        this._invinsibleTimer = new jsGFwk.Timer({ action: function () { self.isInvinsible = false; }, tickTime: 1 });
        this._invinsibleImageSwapperTimer = new jsGFwk.Timer({ action: function () { self.image = self.emptyImage; }, tickTime: 0.05 });
    },

    createParticles: function () {
        if (this.physics.falling) return;

        particlesContainer.cloneObject({ 
            x: this.lookingAt ? this.physics.x : this.physics.x + 20, 
            y: this.physics.y + 20,
            color: { r: 255, g: 255, b: 255 }
        });
    },

    getHit: function () {
        if (this.isInvinsible === true) return;

        gameController._lostPoints();
        this.isInvinsible = true;
    },

    update: function(delta) {
        if (jsGFwk.IO.keyboard.getActiveKeys()[jsGFwk.IO.keyboard.key.D] === true) {
            this.physics.right = true;
            this.lookingAt = true;
            this.createParticles();
        } else {
            this.physics.right = false;
        }

        if (jsGFwk.IO.keyboard.getActiveKeys()[jsGFwk.IO.keyboard.key.A] === true) {
            this.physics.left = true;
            this.lookingAt = false;
            this.createParticles();
        } else {
            this.physics.left = false;
        }

        this.physics.jump = jsGFwk.IO.keyboard.getActiveKeys()[jsGFwk.IO.keyboard.key.W] === true;

        this.firingTrigger -= delta;
        if (this.firingTrigger <= 0) {
            if (jsGFwk.IO.keyboard.getActiveKeys()[jsGFwk.IO.keyboard.key.SPACEBAR] === true && (this.shurikens - 1 > 0)) {
                shurikenContainer.cloneObject({ 
                    x: this.physics.x, 
                    y: this.physics.y,
                    direction: !this.lookingAt ? -1 : 1
                });
                this.firingTrigger = 0.3;
                this.shurikens--;
                powerUpJuke.play();
            };
        }

        this.shurikens += this.reloadSpeed;
        if (this.shurikens > 3) this.shurikens = 3;

        this.physics.update(delta);

        this.x = this.physics.x;
        this.y = this.physics.y;

        this.animAccumulator += delta;

        if (this.animAccumulator > 0.2) {
            jsGFwk.Sprites.playerRight.next();
            jsGFwk.Sprites.playerLeft.next();
            this.animAccumulator = 0;
        }

        this.image = (this.lookingAt === true) ? 
            jsGFwk.Sprites.playerRight.sprite.image : 
            jsGFwk.Sprites.playerLeft.sprite.image;

        if (this.isInvinsible) {
            this._invinsibleTimer.tick(delta);
            this._invinsibleImageSwapperTimer.tick(delta);
        }

    },
    draw: function(ctx) {
        ctx.drawImage(this.image, this.physics.x, this.physics.y);
    }
};

var particles = {
    init: function (parameters) {
        this.particleAcc = 0;
        this.x = parameters.x + (Math.random() * 2);
        this.y = parameters.y + (Math.random() * 2);
        this.speed = (Math.random() * 2) + 1;
        this.angle = Math.atan2((Math.random() * 480) - parameters.y, 
                                (Math.random() * 600) - parameters.x);
        this.gama = 1;
        this.gamaAcc = 0;
        this.particleColor = parameters.color || { r: 0, g: 100, b: 0 };
    },
    update: function (delta) {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        
        this.gamaAcc += delta;
        if (this.gamaAcc > 0.1) {
            this.gamaAcc = 0;
            this.gama -= 0.2;
            this.gama = Math.max(0, this.gama);
        }
        
        this.particleAcc += delta;
        if (this.particleAcc > 0.5) {
            this.destroy();
        }
    },
    draw: function (context) {
        context.beginPath();
        context.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
        context.fillStyle = 'rgba(' + this.particleColor.r + ', ' + this.particleColor.g + ', ' + this.particleColor.b + ',' + this.gama + ')';
        context.fill();
        context.closePath();
    }
};