module User exposing (User, userDecoder)

import Json.Decode exposing (Decoder, int, string)
import Json.Decode.Pipeline exposing (decode, required)


type alias User =
    { fname : String
    , lname : String
    , age : Int
    }


userDecoder : Decoder User
userDecoder =
    decode User
        |> required "fname" string
        |> required "lname" string
        |> required "age" int
