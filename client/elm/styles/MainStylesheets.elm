port module MainStylesheets exposing (..)

import Css.File exposing (CssFileStructure, CssCompilerProgram)
import MainStyle


port files : CssFileStructure -> Cmd msg


fileStructure : CssFileStructure
fileStructure =
    Css.File.toFileStructure
        [ ( "main.css", Css.File.compile [ MainStyle.css ] )
        ]


main : CssCompilerProgram
main =
    Css.File.compiler files fileStructure
