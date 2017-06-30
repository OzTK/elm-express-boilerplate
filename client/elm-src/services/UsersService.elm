module UsersService exposing (Msg(..), loadUsers, searchUsers)

import Http
import Config exposing (config)
import User exposing (User, userDecoder)
import Url exposing (url, urlWithParams)
import Json.Decode exposing (list)


-- UPDATE


type Msg
    = GotUsers (Result Http.Error (List User))



-- HTTP


loadUsers : Cmd Msg
loadUsers =
    Http.send GotUsers <|
        Http.get
            (url config.wsUrl "users")
            (list userDecoder)


searchUsers : String -> Cmd Msg
searchUsers search =
    Http.send GotUsers <|
        Http.get
            (urlWithParams config.wsUrl "users" [] [ ( "s", search ) ])
            (list userDecoder)
