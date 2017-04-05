# elm-express-typescript-webpack-boilerplate

## Intent

Boilerplate for a client+server nodejs app using:
- Express as a server framework
- TypeScript as the server-side language
- Elm as the client-side UI language/framework
- Webpack as bundling tool

The purpose of the project is to have a good balance between a good starting setup, and a simple architecture, with a minimal boilerplate code. I made some opinionated choices, like using NodeJS on the server-side, or using TypeScript. These choices were made from a fullstack developer standpoint, and are not frozen. I'd be happy to find a server-side solution that integrates better with Elm.

**Any advise or help is very welcome to help this project become a very simple, ready-to-go Elm client/server solution. Feel free to create issues/PRs!**

## Installation

## Documentation

### Server-side base architecture

The project was originally generated using the Express packaged boilerplate generator:

```shell
$ npm install express-generator -g
$ express --hbs appDir
```

So it has the base architecture coming with that kind of project:
- A /bin directory with the www file starting our app in it
- An /app file that contains the root logic of our app (routing, middleware, view templating, error handling...)
- Routes, separated in individual files in a specific folder (I renamed /route to /controller to transition to a more MVC-like architecture)
- A /public folder containing everything that will be publicly accessible to the end-user

A key difference with that boilerplate is that everything is in TypeScript instead of JS, and more object oriented.

#### Server
The Server class (*server.ts*) gathers everything related to server's startup and run, on a low level (http). It will take care of plugin the App to the server. The logic of the www file was basically extracted in a separate class.

#### App
The App class (*app.ts*) holds Express configuration and takes care of gluing together middlewares, routes and views.

#### View engine
Handlebars was chosen as a view engine for its extreme simplicity, performances and built-in integration with Express. It can pretty easily be replaced with another Express' supported view engine.

**--> TODO: Make view engine setup generic to easily allow other engines to be configured?**

views all lie in the /view folder as .hbs files, as well as a few helpers in the /views/helpers folder:
- BaseHelper: Defines a base class to ease the creation of new custom helpers
- JsonHelper: Very simple helper allowing to stringify a json object inside a template (This is used here to serialize the Webpack assets file)
- PlaceholderHelper: Allows to define placeholders in a layout view to be replaced in children views by portions of HTML (This is very useful to put script/link tags in the head or at the bottom of the page)

#### Middleware
The /middleware folder holds custom middlewares that can be passed to Express in the form of classes. The BaseCustomMiddleware defines a base contract and behavior for those. Here, the WebpackAssetsParser custom middleware is used to deserialize the Webpack assets file and make it available in templates through a local variable.

**--> Is BaseCustomMiddleware overkill? Do we really need a base class for that?**

#### Controllers (routes)
The concept of route in express is extended here to have a little more structure around server-side logic in the form of a controller. The BaseController class takes care of interacting with Express' route handling to have simple controllers with minimal code inside. It provides callbacks to set routes by providing methods to override depending on the HTTP method desired:

```ts
  protected head(path: string, req: Request, res: Response, next: NextFunction): any {};
  protected get(path: string, req: Request, res: Response, next: NextFunction): any {};
  protected post(path: string, req: Request, res: Response, next: NextFunction): any {};
  protected put(path: string, req: Request, res: Response, next: NextFunction): any {};
  protected delete(path: string, req: Request, res: Response, next: NextFunction): any {};
  protected all(path: string, req: Request, res: Response, next: NextFunction): any {};
```

The inheriting controller then only has to define the routes needed in the constructor, along with the method...
```ts
  constructor() {
    super({ "/": HttpMethod.GET });
  }
```
... and implement the corresponding method from the parent:
```ts
  protected get(path: string, req: Request, res: Response, next: NextFunction): any {
    if (path == "/") {
      let ctx = new BaseContext("Home Page");
      ctx.currentPath = req.path;
      res.render("index", { context: ctx });
    }
  }
```

### Client-side structure

Sources and resources going to the client are composed of two parts:

#### Public folder
The public folder contains everything that is directly going to be consumed by the browser (images, js sources, css sources...). Most of those files will be generated by webpack.

#### Client folder
The client folder contains original source files including Elm sources and one typescript file per page that will be used to load elm modules and styles for that page.

#### Styling

[elm-css](https://github.com/rtfeldman/elm-css) is used for styling. The idea is to have the convenience of a preprocessor while keeping some unity with client-side code. It also brings valuable type checking for classes and ids, making it impossible to make mistakes in elm css code. 

There are two main boilerplate files that enable css generation from elm:

> ElmStyleConfig.elm
>
> ElmStyleSerializer.elm

The first one holds all variables and functions that will be used in elm styling files by just importing them. Multiple files like this can be created depending on the need.

The second one focuses on serializing the elm code to CSS. Every time a new elm styling file is created, it must be added to thile in order for the elm compiler to output the corresponding file in the *client/style* folder:

```elm
fileStructure : CssFileStructure
fileStructure =
    Css.File.toFileStructure
        [ ( "client/styles/main.css", Css.File.compile [ MainStyle.css ] )
        , ( "client/styles/users.css", Css.File.compile [ UsersStyle.css ] )
        ]
```

**NOTE: Right now, this intermediary step generating css files to be then picked up by webpack is used. It seems satisfying enough for now but could probably be improved in the future to avoid unnecessary intermediate files**