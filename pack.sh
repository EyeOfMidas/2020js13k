#!/usr/bin/env bash
rm game.zip
rm min.js
rm pack.js
cat KeyCode.js manualtween.js *-scene.js core.js > pack.js
#npm install terser webpack terser-webpack-plugin
terser --compress --output min.js pack.js
zip game.zip min.js index.html
ls -lah game.zip
