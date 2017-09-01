module Server exposing (ViewContext, Assets, Asset, viewContext, viewContextJson, assets)

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
    { users : Asset, home : Asset, manifest : Asset, error : Asset }


asset : Decoder Asset
asset =
    decode Asset
        |> optional "js" (nullable string) Nothing
        |> optional "css" (nullable string) Nothing


assets : Decoder Assets
assets =
    decode Assets
        |> required "users" asset
        |> required "home" asset
        |> required "manifest" asset
        |> required "error" asset


assetsFromValue : JE.Value -> Result String Assets
assetsFromValue =
    decodeValue assets


viewContext : Decoder c -> Decoder (ViewContext c)
viewContext contextDecoder =
    decode ViewContext
        |> required "context" contextDecoder
        |> required "assets" assets


viewContextJson : ViewContext c -> JE.Value -> List ( String, JE.Value )
viewContextJson vc c =
    [ ( "context", c ), ( "assets", assetsJson vc.assets ) ]


assetsJson : Assets -> JE.Value
assetsJson assets =
    JE.object
        [ ( "users", assetJson assets.users )
        , ( "home", assetJson assets.home )
        , ( "manifest", assetJson assets.manifest )
        , ( "error", assetJson assets.error )
        ]


assetJson : Asset -> JE.Value
assetJson asset =
    JE.object
        [ ( "js"
          , Maybe.map (\a -> JE.string a) asset.js
                |> Maybe.withDefault JE.null
          )
        , ( "css"
          , Maybe.map (\a -> JE.string a) asset.css
                |> Maybe.withDefault JE.null
          )
        ]
