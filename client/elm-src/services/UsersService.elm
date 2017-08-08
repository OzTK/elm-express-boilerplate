module UsersService exposing (loadUsers, searchUsers)

import RemoteData.Http as Http
import Config exposing (config)
import User exposing (User, user)
import Json.Decode exposing (list)
import RemoteData exposing (WebData)


-- HTTP


loadUsers : String -> (WebData (List User) -> msg) -> Cmd msg
loadUsers domain msg =
    Http.get
        (Http.url (endpoint domain "users") [])
        msg
        (list user)


searchUsers : String -> (WebData (List User) -> msg) -> String -> Cmd msg
searchUsers domain msg search =
    Http.getWithConfig
        config.getConfig
        (Http.url (endpoint domain "users") [ ( "s", search ) ])
        msg
        (list user)



-- Utils


endpoint : String -> String -> String
endpoint domain resource =
    domain ++ config.apiPath ++ resource
