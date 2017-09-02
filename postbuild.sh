#!/usr/bin/env sh

copyfiles www\
          config/*\
          package.json\
          dist #Destination dir

copyfiles -f server/views/* dist/views
copyfiles -u 1 'assets/**/*' dist/public

if [ $# == 1 ] && [ "$1" == "--dev" ]; then
  copyfiles elm-package.debug.json webpack.config.js 'elm-stuff/**/*' dist
  mv dist/elm-package.debug.json dist/elm-package.json
fi