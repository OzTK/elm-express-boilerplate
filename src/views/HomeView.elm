module HomeView exposing (view, context)

import Json.Decode.Pipeline exposing (decode, required)
import Json.Decode exposing (Decoder, string)
import Html exposing (Html, h1, h3, div, img, text, node)
import Html.Attributes exposing (href, rel, src, alt)
import Server exposing (ViewContext, Assets, viewContext)
import Layout


-- Model


type alias TitleContext =
    { title : String }


context : Decoder (ViewContext TitleContext)
context =
    decode TitleContext
        |> required "title" string
        |> viewContext



-- View


view : ViewContext TitleContext -> Html Never
view ctx =
    div []
        [ h1 [] [ text ctx.context.title ]
        , img [ alt "ELM", src "/img/elm.png" ] []
        ]
        |> Layout.view (head ctx.assets) (bottom ctx.assets) (Just ctx.assets)


head : Assets -> List (Html msg)
head assets =
    case assets.home.css of
        Just css ->
            [ node "link" [ rel "stylesheet", href css ] [] ]

        Nothing ->
            []


bottom : Assets -> List (Html msg)
bottom assets =
    case assets.home.js of
        Just js ->
            [ node "script" [ src js ] [] ]

        Nothing ->
            []
