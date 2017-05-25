module UsersStyle exposing (..)

import Css exposing (..)
import Css.Elements exposing (body, ul, li)
import ElmStyleConfig exposing (..)


type CssClasses
    = Users


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
        ]
