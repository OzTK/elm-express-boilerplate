#!/usr/bin/env sh

copyfiles www\
          config/*\
          package.json\
          bin #Destination dir

copyfiles -f src/views/* bin/views
copyfiles -u 1 'assets/**/*' bin/public

if [ $# == 1 ] && [ "$1" == "--dev" ]; then 
  rm bin/elm-package.json
  copyfiles elm-package.debug.json webpack.config.js 'elm-stuff/**/*' bin
  mv bin/elm-package.debug.json bin/elm-package.json
fi