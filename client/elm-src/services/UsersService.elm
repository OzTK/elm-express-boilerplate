module UsersService exposing (loadUsers, searchUsers)

import RemoteData.Http as Http
import Config exposing (config)
import User exposing (User, userDecoder)
import Json.Decode exposing (list)
import RemoteData exposing (WebData)


-- HTTP


loadUsers : (WebData (List User) -> msg) -> Cmd msg
loadUsers msg =
    Http.get
        (Http.url (config.wsUrl ++ "users") [])
        msg
        (list userDecoder)


searchUsers : (WebData (List User) -> msg) -> String -> Cmd msg
searchUsers msg search =
    Http.getWithConfig
        config.getConfig
        (Http.url (config.wsUrl ++ "users") [ ( "s", search ) ])
        msg
        (list userDecoder)
