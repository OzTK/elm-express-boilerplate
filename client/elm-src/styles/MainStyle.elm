module MainStyle exposing (..)

import Css exposing (..)
import Css.Elements exposing (body, li, header, h3, h1)
import ElmStyleConfig exposing (..)


type CssClasses
    = NavBar
    | Card


type CssIds
    = Page


css : Stylesheet
css =
    stylesheet
        [ body
            [ overflowX auto
            , minWidth (px 1280)
            , backgroundColor mainBackgroundColor
            , color primaryTextColor
            ]
        , h1 [ margin zero ]
        , header
            [ backgroundColor primaryColor
            , padding (px 12)
            , color accentTextColor
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
                    , marginRight (px 4)
                    ]
                ]
            ]
        , class Card
            [ borderRadius (px 2)
            , backgroundColor (hex "ffffff")
            , margin (px 16)
            , padding (px 8)
            , property "box-shadow" "0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)"
            ]
        ]
