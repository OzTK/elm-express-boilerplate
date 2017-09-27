module Pages.ErrorView exposing (view, context)

import Regex exposing (replace, regex, HowMany(All))
import Json.Decode.Pipeline exposing (decode, required, optional)
import Json.Decode exposing (Decoder, decodeValue, string, nullable, int)
import Html exposing (Html, h1, h2, h3, p, div, text, node)
import Html.Attributes exposing (href, rel, src)
import Server exposing (ViewContext, Assets)
import Layout


-- Model


type alias Error =
    { code : Maybe String, status : Maybe Int, message : String, stacktrace : String }


type alias ErrorContext =
    { message : String, error : Maybe Error, assets : Maybe Server.Assets }


error : Decoder Error
error =
    decode Error
        |> optional "code" (nullable string) Nothing
        |> optional "status" (nullable int) Nothing
        |> required "message" string
        |> required "stack" string


context : Decoder ErrorContext
context =
    decode ErrorContext
        |> required "message" string
        |> required "error" (nullable error)
        |> optional "assets" (nullable Server.assets) Nothing



-- View


view : ErrorContext -> Html Never
view err =
    div []
        ([ h1 [] [ text "Oups!" ]
         , h2 [] [ text err.message ]
         ]
            ++ internalError err
        )
        |> Layout.view (head err.assets) (bottom err.assets) err.assets


internalError : ErrorContext -> List (Html msg)
internalError err =
    case err.error of
        Just error ->
            [ h3 [] [ text ("Error " ++ toString error.status ++ ": " ++ error.message) ]
            , p []
                [ error.stacktrace
                    |> replace All (regex "\n") (\br -> "<br>")
                    |> replace All (regex " ") (\br -> "&nbsp;")
                    |> text
                ]
            ]

        Nothing ->
            []


head : Maybe Assets -> List (Html msg)
head assets =
    assets
        |> Maybe.andThen (\a -> a.error.css)
        |> Maybe.map (\css -> [ node "link" [ rel "stylesheet", href css ] [] ])
        |> Maybe.withDefault []


bottom : Maybe Assets -> List (Html msg)
bottom assets =
    assets
        |> Maybe.andThen (\a -> a.error.js)
        |> Maybe.map (\js -> [ node "script" [ src js ] [] ])
        |> Maybe.withDefault []
