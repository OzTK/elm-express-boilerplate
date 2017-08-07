module HomeView exposing (view)

import Json.Encode as JE
import Json.Decode.Pipeline exposing (decode, required)
import Json.Decode exposing (Decoder, string)
import Html exposing (Html, h1, text)
import Server exposing (ViewContext)
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
    h1 [] [ text ctx.context.title ]
        |> Layout.view [] [] ctx.assets
