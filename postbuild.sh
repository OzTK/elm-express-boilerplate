#!/usr/bin/env sh

copyfiles 'public/**/*'\
          'client/elm-src/**/*'\
          elm-package.json\
          www\
          webpack-assets.json\
          config/*\
          'elm-stuff/**/*'\
          package.json\
          views/*\
          bin #Destination dir

if [[ $# == 1 && $1 == "--dev" ]]
  then 
    rm bin/elm-package.json
    copyfiles elm-package.debug.json webpack.config.js bin
    mv bin/elm-package.debug.json bin/elm-package.json
fi