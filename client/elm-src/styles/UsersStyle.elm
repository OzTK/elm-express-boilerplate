module UsersStyle exposing (..)

import Css exposing (..)
import Css.Colors
import Css.Elements exposing (body, ul, li)
import ElmStyleConfig exposing (..)


type CssClasses
    = Users
    | Error
    | Gone


css : Stylesheet
css =
    stylesheet
        [ class Users
            [ children
                [ li
                    [ color primaryAccentColor
                    ]
                ]
            ]
        , class Error
            [ color Css.Colors.red
            , fontWeight bold
            ]
        , class Gone [ display none ]
        ]
