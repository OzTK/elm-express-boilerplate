module Config exposing (config)


host : String
host =
    "localhost"


port_ : String
port_ =
    "3000"


prefix : String
prefix =
    "http://"


config : { webHome : String, wsUrl : String }
config =
    { wsUrl = prefix ++ host ++ ":" ++ port_ ++ "/api/v1/"
    , webHome = prefix ++ host ++ ":" ++ port_ ++ "/"
    }
