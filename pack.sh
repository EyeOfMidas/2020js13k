#!/usr/bin/env bash
rm game.zip
rm min.js
rm pack.js
cat KeyCode.js manualtween.js colors.js dialog.js *-scene.js core.js > pack.js

if ! command -v terser &> /dev/null; then
	echo "terser not installed!"
	read -p "Would you like to run the npm global install? [Y/n]:" -n 1 -r
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		sudo npm -g install terser webpack terser-webpack-plugin
	else
		echo ""
		exit 1
	fi
fi
#npm -g install terser webpack terser-webpack-plugin
terser --compress --mangle toplevel --output min.js -- pack.js
zip game.zip min.js index.html
ls -lah game.zip
