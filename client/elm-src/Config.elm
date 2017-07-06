module Config exposing (config)

import RemoteData.Http
import Http exposing (Header, header)


host : String
host =
    "localhost"


port_ : String
port_ =
    "3000"


prefix : String
prefix =
    "http://"


config : { webHome : String, wsUrl : String, getConfig : RemoteData.Http.Config }
config =
    { wsUrl = prefix ++ host ++ ":" ++ port_ ++ "/api/v1/"
    , webHome = prefix ++ host ++ ":" ++ port_ ++ "/"
    , getConfig = { headers = [ header "Accept" "application/json" ], withCredentials = False, timeout = Nothing }
    }
