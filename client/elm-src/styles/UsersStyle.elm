module UsersStyle exposing (..)

import Css exposing (..)
import Css.Elements exposing (body, li)
import ElmStyleConfig exposing (..)


type CssClasses
    = Users


css : Stylesheet
css =
    stylesheet
        [ class Users
            [ padding <| px 8
            , children
                [ li
                    [ color primaryAccentColor
                    ]
                ]
            ]
        ]
