module User exposing (User, user, fromValue, listFromValue, toValue)

import Json.Encode as JE
import Json.Decode exposing (Decoder, int, string, list, decodeValue)
import Json.Decode.Pipeline exposing (decode, required)


type alias User =
    { fname : String
    , lname : String
    , age : Int
    }


user : Decoder User
user =
    decode User
        |> required "fname" string
        |> required "lname" string
        |> required "age" int


fromValue : JE.Value -> Result String User
fromValue =
    decodeValue user


toValue : User -> JE.Value
toValue u =
    JE.object
        [ ( "fname", JE.string u.fname )
        , ( "lname", JE.string u.lname )
        , ( "age", JE.int u.age )
        ]


listFromValue : JE.Value -> Result String (List User)
listFromValue =
    decodeValue (list user)
