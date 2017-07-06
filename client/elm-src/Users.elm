module Users exposing (main)

import Html exposing (Html, h1, input, text, ul, li, div, form, label, p)
import Html.Attributes exposing (attribute, type_, name, placeholder, value)
import Html.Events exposing (onInput)
import Html.CssHelpers exposing (withNamespace)
import UsersStyle exposing (..)
import User exposing (User)
import UsersService
import RemoteData exposing (RemoteData(..), WebData)
import Http


-- MODEL


type alias Model =
    { users : WebData UserList, search : String, errorMessage : Maybe String }


type alias Flags =
    { users : UserList, search : String }


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
    | SearchResult UsersService.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SearchChanged s ->
            ( { model | search = s }, Cmd.map SearchResult <| UsersService.searchUsers s )

        SearchResult (UsersService.GotUsers u) ->
            ( { model | users = u }, Cmd.none )


errorClass : Maybe String -> Html.Attribute msg
errorClass err =
    case err of
        Nothing ->
            class [ Gone ]

        Just error ->
            class [ Error ]



-- VIEW


{ class } =
    withNamespace ""


searchView : String -> Html Msg
searchView searchQuery =
    form [ attribute "action" "/users", attribute "autocomplete" "off" ]
        [ div []
            [ input
                [ type_ "search"
                , name "search"
                , placeholder "Search GOT"
                , value searchQuery
                , onInput (\s -> SearchChanged s)
                ]
                []
            ]
        ]


userView : User -> Html Msg
userView user =
    li [] [ text (user.fname ++ " " ++ user.lname) ]


errorView : Http.Error -> Html msg
errorView error =
    p [ class [ Error ] ]
        [ text
            (case error of
                Http.BadStatus err ->
                    err.status.message

                Http.BadPayload _ _ ->
                    "Wrong arguments were used to query the data"

                Http.BadUrl u ->
                    "This service URL is invalid: " ++ u

                Http.NetworkError ->
                    "Impossible to reach the service. Do you have Internet connectivity?"

                Http.Timeout ->
                    "Your request timeout. The server might not be available"
            )
        ]


usersView : WebData (List User) -> Html Msg
usersView users =
    case users of
        Success u ->
            ul [ class [ Users ] ] <| List.map userView <| u

        Loading ->
            text "Loading..."

        Failure err ->
            errorView err

        NotAsked ->
            text "Please type a name"


view : Model -> Html Msg
view model =
    div []
        [ searchView model.search
        , usersView model.users
        ]



-- PROGRAM


main : Program Flags Model Msg
main =
    Html.programWithFlags
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
