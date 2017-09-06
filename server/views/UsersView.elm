module UsersView exposing (..)

import Json.Decode
import Json.Encode as JE
import Html exposing (Html, h1, div, text, node)
import Html.Attributes exposing (src, rel, href, id)
import Server exposing (ViewContext, viewContext, viewContextJson)
import User
import Users
import Layout


context : Json.Decode.Decoder (ViewContext Users.Flags)
context =
    viewContext Users.flags


flagsJson : Users.Flags -> JE.Value
flagsJson ctx =
    JE.object
        [ ( "users", JE.list <| List.map User.toValue ctx.users )
        , ( "search", JE.string ctx.search )
        ]


view : ViewContext Users.Flags -> Html Users.Msg
view ctx =
    Users.init ctx.context
        |> Tuple.first
        |> Users.view
        |> List.singleton
        |> div [ id "app" ]
        |> Layout.view (head ctx) (bottom ctx) (Just ctx.assets)


head : ViewContext Users.Flags -> List (Html msg)
head c =
    case c.assets.users.css of
        Just css ->
            [ node "link" [ rel "stylesheet", href css ] [] ]

        Nothing ->
            []


bottom : ViewContext Users.Flags -> List (Html msg)
bottom c =
    case c.assets.users.js of
        Just js ->
            [ node "script" [] [ text ("var context = " ++ JE.encode 4 (flagsJson c.context) ++ ";") ]
            , node "script" [ src js ] []
            ]

        Nothing ->
            []
