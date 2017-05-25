module Users exposing (main)

import Html exposing (Html, h1, input, text, ul, li, div, form, label)
import Html.Attributes exposing (attribute, type_, name, placeholder, value)
import Html.Events exposing (onInput)
import Html.CssHelpers exposing (withNamespace)
import UsersStyle exposing (..)
import User exposing (User)


-- MODEL


type alias Model =
    { users : UserList, search : String }


type alias Flags =
    Model


type alias UserList =
    List User


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { users = flags.users, search = flags.search }, Cmd.none )



-- UPDATE


type Msg
    = SearchChanged String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SearchChanged s ->
            ( { model | search = s }, Cmd.none )


filterUsers : String -> UserList -> UserList
filterUsers searchQuery users =
    List.filter
        (\u ->
            searchQuery
                == ""
                || String.contains (String.toLower searchQuery) (String.toLower u.lname)
                || String.contains (String.toLower searchQuery) (String.toLower u.fname)
        )
        users



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


view : Model -> Html Msg
view model =
    div []
        [ searchView model.search
        , ul [ class [ Users ] ] <|
            List.map userView <|
                filterUsers model.search model.users
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
