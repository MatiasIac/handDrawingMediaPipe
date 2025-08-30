const background = {
    id: 11,
    name: "background",
    isVisible: true,
    x: 0,
    
    init: function() {
    },
    
    update: function(delta) {
        if (!IS_IDLE) {
            this.x -= GLOBAL_SPEED;
        }

        if (this.x < -sprites.SPRITES_BAG.floor.width) {
            this.x = 0;
        }
    },

    draw: function(ctx) {
        ctx.drawImage(sprites.SPRITES_BAG.floor.graphic, this.x, FLOOR_Y - 10);
        ctx.drawImage(sprites.SPRITES_BAG.floor.graphic, this.x + sprites.SPRITES_BAG.floor.width, FLOOR_Y - 10);
    }
}