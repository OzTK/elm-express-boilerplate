port module ElmStyleSerializer exposing (..)

import Css.File exposing (CssFileStructure, CssCompilerProgram)
import MainStyle
import UsersStyle


port files : CssFileStructure -> Cmd msg


fileStructure : CssFileStructure
fileStructure =
    Css.File.toFileStructure
        [ ( "client/styles/main.css", Css.File.compile [ MainStyle.css ] )
        , ( "client/styles/users.css", Css.File.compile [ UsersStyle.css ] )
        ]


main : CssCompilerProgram
main =
    Css.File.compiler files fileStructure
