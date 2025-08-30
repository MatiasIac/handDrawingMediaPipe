const enemyController = {
    id: 111,
    name: "enemyController",
    isVisible: false,
    dropEnemyTime: 2,
    dropAccumulator: 0,
    animSpeed: 0,

    init: function() { 
        pteroContainer.clearAll();
    },

    update: function (delta) {
        this.dropAccumulator += delta;
        this.animSpeed += delta;

        if (IS_IDLE || IS_DEAD) {
            cactusContainer.clearAll();
            pteroContainer.clearAll();
            return;
        }

        if (this.animSpeed > 0.1) {
            sprites.SPRITES_BAG.pterodactyl.moveNextSprite();
            this.animSpeed = 0;
        }

        if (this.dropAccumulator > this.dropEnemyTime) {
            this.dropAccumulator = 0;

            if (Math.random() < 0.5) {
                cactusContainer.cloneObject();
            } else {
                pteroContainer.cloneObject();
            }
        }

    }
};