module Users exposing (main)

import Html exposing (Html, h1, input, text, ul, li, div, form, label, p)
import Html.Attributes exposing (attribute, type_, name, placeholder, value)
import Html.Events exposing (onInput)
import Html.CssHelpers exposing (withNamespace)
import UsersStyle exposing (..)
import User exposing (User)
import UsersService


-- MODEL


type alias Model =
    { users : UserList, search : String, errorMessage : Maybe String }


type alias Flags =
    { users : UserList, search : String }


type alias UserList =
    List User


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { users = flags.users
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

        SearchResult (UsersService.GotUsers (Ok u)) ->
            ( { model | users = u, errorMessage = Nothing }, Cmd.none )

        SearchResult (UsersService.GotUsers (Err u)) ->
            ( { model | errorMessage = Just "Error retrieving users" }, Cmd.none )


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


errorView : Maybe String -> Html msg
errorView errorMessage =
    p [ errorClass errorMessage ] [ text <| Maybe.withDefault "" errorMessage ]


view : Model -> Html Msg
view model =
    div []
        [ searchView model.search
        , errorView model.errorMessage
        , ul [ class [ Users ] ] <| List.map userView <| model.users
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
