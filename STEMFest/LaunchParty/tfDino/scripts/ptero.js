let ptero = {
    id: 13,
    name: 'ptero',
    isVisible: true,
    x: 600,
    y: 25,
    width: 46,
    height: 40,
    realSpeed: GLOBAL_SPEED + 0.5,

    init: function (params) { 
        this.realSpeed = GLOBAL_SPEED + 0.5;
    },

    update: function (delta) {
        this.x -= this.realSpeed;

        const collide = collisions.areCollidingBy({ 
            x: this.x + 5, 
            y: this.y + 15, 
            width: this.width - 5, 
            height: this.height - 20 
        }, dino.CURRENT_STATE._boundingBox, jsGFwk.Collisions.RECTANGLE_COLLISION_MODE);

        if (collide) {
            dino.triggerDeath();
            this.destroy();
        }

        if (this.x < -this.width) {
            this.destroy(); 
        }
    },
    draw: function (ctx) {
        ctx.drawImage(sprites.SPRITES_BAG.pterodactyl.sprite.image, this.x, this.y);

        //ctx.strokeStyle = 'red';
        //ctx.beginPath();
        //ctx.rect(this.x + 5, this.y + 15, this.width - 5, this.height - 20);
        //ctx.stroke();
    }
};