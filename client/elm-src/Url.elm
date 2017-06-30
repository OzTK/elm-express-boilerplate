module Url exposing (..)


urlWithParams : String -> String -> List String -> List ( String, String ) -> String
urlWithParams baseUrl path rParams qParams =
    let
        route =
            "/" ++ (String.join "/" rParams)

        query =
            "?" ++ (String.join "&" <| List.map (\( k, v ) -> k ++ "=" ++ v) qParams)
    in
        case ( route, query ) of
            ( "/", "?" ) ->
                baseUrl ++ path

            ( "/", _ ) ->
                baseUrl ++ path ++ query

            ( _, "?" ) ->
                baseUrl ++ path ++ route

            _ ->
                baseUrl ++ path ++ route ++ query


url : String -> String -> String
url baseUrl path =
    urlWithParams baseUrl path [] []
