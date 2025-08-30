const cactus = {
    id: 1111,
    name: 'cactus',
    isVisible: true,
    x: 600,
    y: 60,
    width: 34,
    height: 35,

    init: function () { },

    update: function (delta) { 
        this.x -= GLOBAL_SPEED;

        const collide = collisions.areCollidingBy(this, dino.CURRENT_STATE._boundingBox, jsGFwk.Collisions.RECTANGLE_COLLISION_MODE);

        if (collide) {
            dino.triggerDeath();
            this.destroy();
        }

        if (this.x < -this.width) {
            this.destroy();
        }
    },

    draw: function(ctx) {
        ctx.drawImage(sprites.SPRITES_BAG.cactus.graphic, this.x, this.y);

        //ctx.strokeStyle = 'red';
        //ctx.beginPath();
        //ctx.rect(this.x, this.y, this.width, this.height);
        //ctx.stroke();
    }

};