module Users
    exposing
        ( Flags
        , Msg(..)
        , flags
        , main
        , view
        , root
        , init
        , userView
        , usersView
        , errorView
        , errorMessage
        , searchView
        , badPayloadErrorMessage
        , badUrlErrorMessage
        , networkErrorMessage
        , timeoutErrorMessage
        , loadingText
        , loadInstructionText
        )

import Html exposing (Html, h1, input, text, ul, li, div, form, label, p)
import Html.Attributes exposing (attribute, type_, name, placeholder, value)
import Html.Events exposing (onInput)
import Html.CssHelpers exposing (withNamespace)
import UsersStyle exposing (..)
import User exposing (User, user)
import UsersService
import RemoteData exposing (RemoteData(..), WebData)
import Json.Decode exposing (string, list)
import Json.Decode.Pipeline exposing (decode, required, optional)
import Http


-- MODEL


badPayloadErrorMessage : String
badPayloadErrorMessage =
    "Wrong arguments were used to query the data"


badUrlErrorMessage : String -> String
badUrlErrorMessage url =
    "This service URL is invalid: " ++ url


networkErrorMessage : String
networkErrorMessage =
    "Impossible to reach the service. Do you have Internet connectivity?"


timeoutErrorMessage : String
timeoutErrorMessage =
    "Your request timeout. The server might not be available"


loadingText : String
loadingText =
    "Loading..."


loadInstructionText : String
loadInstructionText =
    "Please type a name"


type alias Model =
    { users : WebData UserList, search : String, errorMessage : Maybe String }


type alias Flags =
    { users : UserList, search : String }


flags : Json.Decode.Decoder Flags
flags =
    decode Flags
        |> required "users" (list user)
        |> optional "search" string ""


type alias UserList =
    List User


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { users = Success flags.users
      , search = flags.search
      , errorMessage = Nothing
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = SearchChanged String
    | SearchResult (WebData (List User))


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SearchChanged s ->
            ( { model | search = s, users = Loading }, UsersService.searchUsers SearchResult s )

        SearchResult u ->
            ( { model | users = u }, Cmd.none )


errorMessage : Http.Error -> String
errorMessage error =
    case error of
        Http.BadStatus err ->
            err.status.message

        Http.BadPayload _ _ ->
            badPayloadErrorMessage

        Http.BadUrl u ->
            badUrlErrorMessage u

        Http.NetworkError ->
            networkErrorMessage

        Http.Timeout ->
            timeoutErrorMessage



-- VIEW


{ class } =
    withNamespace ""


searchView : (String -> msg) -> String -> Html msg
searchView msg searchQuery =
    form [ attribute "action" "/users", attribute "autocomplete" "off" ]
        [ div []
            [ input
                [ type_ "search"
                , name "search"
                , placeholder "Search GOT"
                , value searchQuery
                , onInput msg
                ]
                []
            ]
        ]


userView : User -> Html msg
userView user =
    li [] [ text (user.fname ++ " " ++ user.lname) ]


errorView : Http.Error -> Html msg
errorView error =
    p [ class [ Error ] ]
        [ text <| errorMessage error ]


usersView : WebData (List User) -> Html msg
usersView users =
    case users of
        Success u ->
            ul [ class [ Users ] ] <| List.map userView <| u

        Loading ->
            p [] [ text loadingText ]

        Failure err ->
            errorView err

        NotAsked ->
            text loadInstructionText


root : (String -> msg) -> { a | search : String, users : WebData UserList } -> Html msg
root onSearchChanged model =
    div []
        [ searchView onSearchChanged model.search
        , usersView model.users
        ]


view : Model -> Html Msg
view model =
    root SearchChanged model



-- PROGRAM


main : Program Flags Model Msg
main =
    Html.programWithFlags
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
