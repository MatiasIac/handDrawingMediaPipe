var map = {
    id: "map",
    visible: true,

    shurikenMaxWidth: 52,
    shurikenCurrentWidth: 0,

    init: function() {},
    update: function(delta) {
        this.shurikenCurrentWidth = (((player.shurikens * 100) / 3) / 100) * this.shurikenMaxWidth;
    },

    draw: function(ctx) {
        ctx.drawImage(jsGFwk.Sprites.background.image, 0, 0);

        for(var y = 0 ; y < MAP.th ; y++) {
            for(var x = 0 ; x < MAP.tw ; x++) {
                var tileType = tcell(x, y);
                
                if (tileType === 0) continue;

                var tile = jsGFwk.Sprites.platforms.spriteBag[tileType].image;
                ctx.drawImage(tile, x * TILE, y * TILE);
            }
        }

        ctx.drawImage(jsGFwk.Sprites.shurikenHolder.image, 20, 0);
        ctx.drawImage(jsGFwk.Sprites.shurikenMeter.image, 
            0, 0, this.shurikenCurrentWidth, 16,
            TILE + 5, 2, this.shurikenCurrentWidth, 16);

        ctx.drawImage(jsGFwk.Sprites.coinHolder.image, game.configurations.width - (100 + TILE), 0);

        ctx.fillStyle = "#ffffff";
        ctx.font = "14pt arial";
        ctx.fillText(gameController.points, game.configurations.width - 95, 18);
    }
};