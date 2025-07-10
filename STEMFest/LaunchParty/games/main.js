var particlesContainer = jsGFwk.Container.createContainer('particles', particles, true);
var enemyContainer = jsGFwk.Container.createContainer("enemyContainer", enemy, true);
var shurikenContainer = jsGFwk.Container.createContainer("shurikenContainer", shuriken, true);
var coinContainer = jsGFwk.Container.createContainer("coinContainer", coin, true);
var coinJuke = null;
var powerUpJuke = null;
var hurtJuke = null;

game.init = function () {
    jsGFwk.ResourceManager.addGraphic({ name: "main", source: "games/images/sprites.png" });

    var sound = {};
    sound[jsGFwk.ResourceManager.sounds.format.ogg] = { source: "games/fx/coin.ogg" };
    sound[jsGFwk.ResourceManager.sounds.format.mp3] = { source: "games/fx/coin.mp3" };
    sound[jsGFwk.ResourceManager.sounds.format.wave] = { source: "games/fx/coin.wav" };
    jsGFwk.ResourceManager.addSound({ name: "coin", sources: sound});

    sound = {};
    sound[jsGFwk.ResourceManager.sounds.format.ogg] = { source: "games/fx/powerup.ogg" };
    sound[jsGFwk.ResourceManager.sounds.format.mp3] = { source: "games/fx/powerup.mp3" };
    sound[jsGFwk.ResourceManager.sounds.format.wave] = { source: "games/fx/powerup.wav" };
    jsGFwk.ResourceManager.addSound({ name: "powerup", sources: sound});

    sound = {};
    sound[jsGFwk.ResourceManager.sounds.format.ogg] = { source: "games/fx/hurt.ogg" };
    sound[jsGFwk.ResourceManager.sounds.format.mp3] = { source: "games/fx/hurt.mp3" };
    sound[jsGFwk.ResourceManager.sounds.format.wave] = { source: "games/fx/hurt.wav" };
    jsGFwk.ResourceManager.addSound({ name: "hurt", sources: sound});

    sound = {};
    sound[jsGFwk.ResourceManager.sounds.format.ogg] = { source: "games/fx/music.ogg" };
    sound[jsGFwk.ResourceManager.sounds.format.mp3] = { source: "games/fx/music.mp3" };
    sound[jsGFwk.ResourceManager.sounds.format.wave] = { source: "games/fx/music.mp3" };
    jsGFwk.ResourceManager.addSound({ name: "music", sources: sound});

    //load all question images

    //jsGFwk.Scenes.create({ name: "hud", gameObjects: [background, hud] });
    jsGFwk.Scenes.create({ name: "game", gameObjects: [
        map,
        gameController,
        coinContainer,
        player,
        shurikenContainer,
        enemyContainer,
        particlesContainer,
        clock
    ]});

    //jsGFwk.Scenes.create({ name: "endgame", gameObjects: [
    //    background,
    //    points
    //]});

    jsGFwk.ResourceManager.onResourcesLoadedCompleted = function() {
    
        jsGFwk.Sprites.createSpriteCollection("enemyRight", jsGFwk.ResourceManager.graphics.main.image, 
            [{ left: 40, top: 70, width: 20, height: 20 }, { left: 60, top: 70, width: 20, height: 20 }]);
        jsGFwk.Sprites.enemyRight.loop(true);

        jsGFwk.Sprites.createSpriteCollection("enemyLeft", jsGFwk.ResourceManager.graphics.main.image,
            [{ left: 40, top: 70, width: 20, height: 20, inverted: true }, { left: 60, top: 70, width: 20, height: 20, inverted: true }]);
        jsGFwk.Sprites.enemyLeft.loop(true);

        jsGFwk.Sprites.createSpriteCollection("playerRight", jsGFwk.ResourceManager.graphics.main.image,
            [{ left: 0, top: 70, width: 20, height: 20 }, { left: 20, top: 70, width: 20, height: 20 }]);
        jsGFwk.Sprites.playerRight.loop(true);

        jsGFwk.Sprites.createSpriteCollection("playerLeft", jsGFwk.ResourceManager.graphics.main.image,
            [{ left: 0, top: 70, width: 20, height: 20, inverted: true }, { left: 20, top: 70, width: 20, height: 20, inverted: true }]);
        jsGFwk.Sprites.playerLeft.loop(true);

        jsGFwk.Sprites.createSpriteCollection("platforms", jsGFwk.ResourceManager.graphics.main.image,
            [
                { left: 0, top: 0, width: 20, height: 20 }, //void tile

                //green tiles = 1, 2, 3
                { left: 20, top: 0, width: 20, height: 20 },
                { left: 40, top: 0, width: 20, height: 20 },
                { left: 60, top: 0, width: 20, height: 20 },

                //brown tiles = 4, 5, 6
                { left: 20, top: 20, width: 20, height: 20 },
                { left: 40, top: 20, width: 20, height: 20 },
                { left: 60, top: 20, width: 20, height: 20 },

                //red brick, 7
                { left: 20, top: 40, width: 20, height: 20 },

                //tile roof, 8, 9, 10
                { left: 40, top: 40, width: 20, height: 20 },
                { left: 60, top: 40, width: 20, height: 20 },
                { left: 80, top: 40, width: 20, height: 20 },

                //door = 11
                { left: 80, top: 20, width: 20, height: 20 },

                //transparent = 12
                { left: 0, top: 20, width: 20, height: 20 }

            ]);
        jsGFwk.Sprites.platforms.loop(false);

        jsGFwk.Sprites.createSpriteCollection("shuriken", jsGFwk.ResourceManager.graphics.main.image,
        [
            { left: 80, top: 70, width: 20, height: 20 },
            { left: 100, top: 70, width: 20, height: 20 }
        ]);
        jsGFwk.Sprites.shuriken.loop(false);

        jsGFwk.Sprites.createSprite({ 
            id: "background", 
            graphic: jsGFwk.ResourceManager.graphics.main.image, 
            left: 120, top: 0, width: 480, height: 600 
        });

        jsGFwk.Sprites.createSprite({ 
            id: "shurikenHolder", 
            graphic: jsGFwk.ResourceManager.graphics.main.image, 
            left: 0, top: 340, width: 60, height: 20 
        });

        jsGFwk.Sprites.createSprite({ 
            id: "coinHolder", 
            graphic: jsGFwk.ResourceManager.graphics.main.image, 
            left: 0, top: 380, width: 100, height: 20 
        });

        jsGFwk.Sprites.createSprite({ 
            id: "shurikenMeter", 
            graphic: jsGFwk.ResourceManager.graphics.main.image, 
            left: 0, top: 360, width: 52, height: 16 
        });
        
        jsGFwk.Sprites.createSpriteCollection("coin", jsGFwk.ResourceManager.graphics.main.image,
        [
            { left: 0, top: 93, width: 20, height: 20 },
            { left: 20, top: 93, width: 20, height: 20 },
            { left: 40, top: 93, width: 20, height: 20 },
            { left: 60, top: 93, width: 20, height: 20 },
            { left: 80, top: 93, width: 20, height: 20 },
            { left: 100, top: 93, width: 20, height: 20 }
        ]);
        jsGFwk.Sprites.coin.loop(true);

        coinJuke = new jsGFwk.Jukebox({
            volume: 0.5,
            channels: 5,
            source: jsGFwk.ResourceManager.sounds.coin
        });

        powerUpJuke = new jsGFwk.Jukebox({
            volume: 0.5,
            channels: 2,
            source: jsGFwk.ResourceManager.sounds.powerup
        });

        hurtJuke = new jsGFwk.Jukebox({
            volume: 0.5,
            channels: 5,
            source: jsGFwk.ResourceManager.sounds.hurt
        });

        jsGFwk.ResourceManager.sounds.music.audio.volume = 0.3;
        jsGFwk.ResourceManager.sounds.music.audio.loop = true;

        jsGFwk.Scenes.scenes.game.enable();
    };

};