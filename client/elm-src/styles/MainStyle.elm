module MainStyle exposing (..)

import Css exposing (..)
import Css.Elements exposing (body, li, header, h3)
import ElmStyleConfig exposing (..)


type CssClasses
    = NavBar


type CssIds
    = Page


css : Stylesheet
css =
    stylesheet
        [ body
            [ overflowX auto
            , minWidth (px 1280)
            ]
        , header
            [ backgroundColor primaryColor
            , color primaryTextColor
            , children
                [ h3 [ marginTop zero ]
                ]
            ]
        , id Page
            [ width (pct 100)
            , height (pct 100)
            , boxSizing borderBox
            , margin zero
            ]
        , class NavBar
            [ margin zero
            , padding zero
            , children
                [ li
                    [ (display inlineBlock) |> important
                    , color primaryAccentColor
                    ]
                ]
            ]
        ]
