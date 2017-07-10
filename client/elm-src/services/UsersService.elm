module UsersService exposing (Msg(..), loadUsers, searchUsers)

import RemoteData.Http as Http
import Config exposing (config)
import User exposing (User, userDecoder)
import Url exposing (url, urlWithParams)
import Json.Decode exposing (list)
import RemoteData exposing (WebData)


-- UPDATE


type Msg
    = GotUsers (WebData (List User))



-- HTTP


loadUsers : Cmd Msg
loadUsers =
    Http.get
        (url config.wsUrl "users")
        GotUsers
        (list userDecoder)


searchUsers : String -> Cmd Msg
searchUsers search =
    Http.getWithConfig
        config.getConfig
        (urlWithParams config.wsUrl "users" [] [ ( "s", search ) ])
        GotUsers
        (list userDecoder)
