declare var context: any;

require("../styles/users.css")

const ElmUsers = require("../elm-src/Users.elm");
ElmUsers.Users.embed(document.getElementById("app"), context);