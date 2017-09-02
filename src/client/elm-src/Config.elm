module Config exposing (config)

import RemoteData.Http
import Http exposing (Header, header)


config : { apiPath : String, getConfig : RemoteData.Http.Config }
config =
    { apiPath = "/api/v1/"
    , getConfig = { headers = [ header "Accept" "application/json" ], withCredentials = False, timeout = Nothing }
    }
