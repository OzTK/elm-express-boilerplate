# elm-express-boilerplate [![Build Status](https://travis-ci.org/OzTK/elm-express-boilerplate.svg?branch=master)](https://travis-ci.org/OzTK/elm-express-boilerplate)

## Intent

Boilerplate for a client+server multipage elm app using:
- Express as a web framework
- TypeScript as the server-side language
- Elm as the client-side UI language/framework
- Webpack as bundling tool

The purpose of the project is to have a good balance between a good starting setup, and a simple architecture, with a minimal boilerplate code. I made some opinionated choices, like using NodeJS on the server-side, or using TypeScript. These choices were made from a fullstack developer standpoint, and are not frozen. I'd be happy to find a server-side solution that integrates better with Elm.

**Any advise or help is very welcome to help this project become a very simple, ready-to-go Elm client/server solution. Feel free to create issues/PRs!**

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

Everything is in TypeScript.

#### Server
The server is bootstrapped from the bin/www script where the App is instianciated and started.

#### App
The App class (*app.ts*) holds Express configuration and takes care of gluing together middlewares, routes and views.

#### View engine
Handlebars was chosen as a view engine for its extreme simplicity, performances and built-in integration with Express. It can pretty easily be replaced with another Express' supported view engine.

**--> TODO: Make view engine setup generic to easily allow other engines to be configured**
**--> Even better: make it usable with [elm-server-side-renderer]("https://github.com/eeue56/elm-server-side-renderer")**

views all lie in the /view folder as .hbs files, as well as a few helpers in the /views/helpers folder:
- BaseHelper: Defines a base class to ease the creation of new custom helpers
- JsonHelper: Very simple helper allowing to stringify a json object inside a template (This is used here to pass a context object as a Flag argument to our Elm app)
- PlaceholderHelper: Allows to define placeholders in a layout view to be replaced in children views by portions of HTML (This is very useful to put script/link tags in the head or at the bottom of the body)

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

To add a separate CSS file, just create a new Elm style file with your styles in the *client/elm-src/styles* folder and add a line to the *ElmStyleSerializer.elm* file:

```elm
fileStructure : CssFileStructure
fileStructure =
    Css.File.toFileStructure
        [ ( "client/styles/main.css", Css.File.compile [ MainStyle.css ] )
        , ( "client/styles/users.css", Css.File.compile [ UsersStyle.css ]
        , ( "client/styles/my-new-style.css", Css.File.compile [ MyNewStyle.css ] )
        ]
```