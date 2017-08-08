port module HomeStylesheets exposing (..)

import Css.File exposing (CssFileStructure, CssCompilerProgram)
import MainStyle
import HomeStyle


port files : CssFileStructure -> Cmd msg


fileStructure : CssFileStructure
fileStructure =
    Css.File.toFileStructure
        [ ( "main.css", Css.File.compile [ MainStyle.css ] )
        , ( "home.css", Css.File.compile [ HomeStyle.css ] )
        ]


main : CssCompilerProgram
main =
    Css.File.compiler files fileStructure
