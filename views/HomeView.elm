module HomeView exposing (view)

import Json.Encode as JE
import Json.Decode.Pipeline exposing (decode, required)
import Json.Decode exposing (Decoder, string)
import Html exposing (Html, h1, div, img, text, node)
import Html.Attributes exposing (href, rel, src, alt)
import Server exposing (ViewContext, Assets)
import Layout


-- Model


type alias TitleContext =
    { title : String }


title : Decoder TitleContext
title =
    decode TitleContext |> required "title" string



-- View


view : msg -> JE.Value -> Result String (Html msg)
view msg jsonCtx =
    Server.viewContextFromValue title jsonCtx
        |> Result.map home


home : ViewContext TitleContext -> Html msg
home ctx =
    div []
        [ h1 [] [ text ctx.context.title ]
        , img [ alt "ELM", src "/images/elm.png" ] []
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
