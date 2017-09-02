import "./elm/styles/UsersStylesheets";

declare var context: any;

const ElmUsers = require("./elm/Users.elm");
ElmUsers.Users.embed(document.getElementById("app"), context);