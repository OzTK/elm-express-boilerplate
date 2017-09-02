module HomeStyle exposing (..)

import Css exposing (..)
import Css.Elements exposing (div, img)
import Css.Colors
import ElmStyleConfig exposing (..)


type CssClasses
    = HomeTitle
    | MagicLink


css : Stylesheet
css =
    stylesheet
        [ class HomeTitle
            [ color primaryAccentColor
            ]
        , class MagicLink
            [ color Css.Colors.red
            , fontWeight bold
            ]
        , div [ textAlign center ]
        , img [ marginTop (px 8) ]
        ]
