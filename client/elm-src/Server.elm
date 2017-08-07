module Server exposing (ViewContext, Assets, Asset, viewContextFromValue, assets)

import Json.Encode as JE
import Json.Decode exposing (Decoder, int, string, list, nullable, decodeValue)
import Json.Decode.Pipeline exposing (decode, required, optional)


type AssetType
    = Css
    | Js


type alias Asset =
    { js : Maybe String
    , css : Maybe String
    }


type alias ViewContext c =
    { context : c, assets : Assets }


type alias Assets =
    { shared : Asset, users : Asset, manifest : Asset }


asset : Decoder Asset
asset =
    decode Asset
        |> optional "js" (nullable string) Nothing
        |> optional "css" (nullable string) Nothing


assets : Decoder Assets
assets =
    decode Assets
        |> required "shared" asset
        |> required "users" asset
        |> required "manifest" asset


assetsFromValue : JE.Value -> Result String Assets
assetsFromValue =
    decodeValue assets


viewContext : Decoder c -> Decoder (ViewContext c)
viewContext contextDecoder =
    decode ViewContext
        |> required "context" contextDecoder
        |> required "assets" assets


viewContextFromValue : Decoder c -> JE.Value -> Result String (ViewContext c)
viewContextFromValue dec =
    decodeValue <| viewContext dec
