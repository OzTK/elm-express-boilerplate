# elm-express-boilerplate [![Build Status](https://travis-ci.org/OzTK/elm-express-boilerplate.svg?branch=master)](https://travis-ci.org/OzTK/elm-express-boilerplate)

## Intent

Boilerplate for a client+server multipage elm app using:
- Express as a web framework
- TypeScript as the server-side language
- Elm as the client-side UI language/framework
- Webpack as bundling tool

The boilerplate has the following out of the box:
- MVC architecture
- Dependency injection
- Elm on the frontend + as a template engine
- Elm-css
- Rest api controllers
- Webpack configuration with support for typescript + Elm + Elm-css
- Hot Module Reloading (Elm)
- File/Console logging (winston)
- Some must-have middlewares (security)
- Travis CI + Heroku deployment configuration

## Installation

Just clone the repository and remove the git folder:

```shell
$ git clone https://github.com/OzTK/elm-express-typescript-webpack-boilerplate MyProject && rm -rf .git
```

## Documentation

### Server-side base architecture

The project was originally generated using the Express packaged boilerplate generator:

```shell
$ npm install express-generator -g
$ express --hbs appDir
```

It has the base architecture coming with that kind of project, with a couple modifications to make it a little more 

Everything is written in TypeScript.

#### Server
The server is bootstrapped from the www script where the App is instanciated, configured and started.

#### App
The App class (*app.ts*) holds Express configuration and takes care of gluing together middlewares, routes and views.

#### Template engine
[elm-view-engine](https://github.com/OzTK/elm-view-engine) is used to render Express views, allowing to reuse Elm views when loading the page.

### IoC and MVC
[Inversify](http://inversify.io/) is used as an IoC container. [inversify-express-utils](https://github.com/inversify/inversify-express-utils) helpers allow clean and simple controllers on top of the usual Express routes.

### Client-side

Webpack is used to generate client-side assets and scripts. All Elm modules required in a page will have to be required in the corresping javascript. Webpack will take care of bundling everything as one js file that can then be referenced in the view:

``` Handlebars
{{#placeholder-content "js"}}
<script>
  var context = {{{json context}}}
</script>
<script src="{{assets.users.js}}"></script>
{{/placeholder-content}}
```

The assets template variable is coming from the webpack assets report, that is serialized into a file after webpack runs (Using the WabpackAssetsParser middleware). It contains the paths to the js and css files. Those paths will contain hash in production and can't be predicted.

#### Styling

[elm-css](https://github.com/rtfeldman/elm-css) is used as a CSS pre-processor. *ElmStyleSerializer.elm* is used as the bootstrapper class to generate all the stylesheets in the *client/styles* folder. These files are then picked up by Webpack and moved into the public folder when they are imported.

To add a separate CSS file, just create a new Elm style file with your styles in the *client/elm-src/styles* folder and add a style file per page, grouping all the style required for that page:

```elm
fileStructure : CssFileStructure
fileStructure =
    Css.File.toFileStructure
        [ ( "client/styles/main.css", Css.File.compile [ MainStyle.css ] )
        , ( "client/styles/users.css", Css.File.compile [ UsersStyle.css ] )
        ]
```
Then, add a rule for this style file in webpack.config.js.
