module ErrorView exposing (view)

import Json.Encode as JE
import Regex exposing (replace, regex, HowMany(All))
import Json.Decode.Pipeline exposing (decode, required, optional)
import Json.Decode exposing (Decoder, decodeValue, string, nullable, int)
import Html exposing (Html, h1, h2, h3, p, div, text)
import Server exposing (ViewContext)
import Layout


-- Model


type alias Error =
    { status : Int, message : String, stacktrace : String }


type alias ErrorContext =
    { message : String, error : Maybe Error, assets : Server.Assets }


error : Decoder Error
error =
    decode Error
        |> required "status" int
        |> required "message" string
        |> required "stack" string


errorContext : Decoder ErrorContext
errorContext =
    decode ErrorContext
        |> required "message" string
        |> required "error" (nullable error)
        |> required "assets" Server.assets



-- View


view : msg -> JE.Value -> Result String (Html msg)
view msg jsonCtx =
    decodeValue errorContext jsonCtx
        |> Result.map displayError


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


displayError : ErrorContext -> Html msg
displayError err =
    div []
        ([ h1 [] [ text "Oups!" ]
         , h2 [] [ text err.message ]
         ]
            ++ internalError err
        )
        |> Layout.view [] [] err.assets
