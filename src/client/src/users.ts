import "../elm-src/styles/UsersStylesheets";

declare var context: any;

const ElmUsers = require("../elm-src/Users.elm");
ElmUsers.Users.embed(document.getElementById("app"), context);