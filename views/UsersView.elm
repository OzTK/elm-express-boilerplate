module UsersView exposing (..)

import Json.Encode as JE
import Html exposing (Html, h1, div, text, node)
import Html.Attributes exposing (src, rel, href, id)
import Server exposing (ViewContext)
import RemoteData exposing (RemoteData(..), WebData)
import Users
import Layout


view : msg -> JE.Value -> Result String (Html msg)
view msg jsonCtx =
    Server.viewContextFromValue Users.flags jsonCtx
        |> Result.map (users msg jsonCtx)


users : msg -> JE.Value -> ViewContext Users.Flags -> Html msg
users msg jsonCtx c =
    Users.root (\_ -> msg) { search = c.context.search, url = c.context.url, users = Success c.context.users }
        |> flip (::) []
        |> div [ id "app" ]
        |> Layout.view (head c) (bottom jsonCtx c) c.assets


head : ViewContext Users.Flags -> List (Html msg)
head c =
    case c.assets.users.css of
        Just css ->
            [ node "link" [ rel "stylesheet", href css ] [] ]

        Nothing ->
            []


bottom : JE.Value -> ViewContext Users.Flags -> List (Html msg)
bottom jsonCtx c =
    case c.assets.users.js of
        Just js ->
            [ node "script" [] [ text ("var context = " ++ (JE.encode 4 jsonCtx) ++ ".context;") ]
            , node "script" [ src js ] []
            ]

        Nothing ->
            []
