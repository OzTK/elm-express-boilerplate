module UsersTest exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, list, int, string, tuple)
import Test exposing (..)
import Test.Html.Query as Query
import Test.Html.Selector exposing (tag, text, attribute, class)
import Users exposing (..)
import User exposing (User)
import Http
import Dict
import RemoteData exposing (RemoteData(..), WebData)


fakeErrorMessage : String
fakeErrorMessage =
    "bad test response"


badStatusError : Http.Error
badStatusError =
    Http.BadStatus
        (Http.Response "fakeUrl" { code = 404, message = fakeErrorMessage } Dict.empty "")


badPayloadError : Http.Error
badPayloadError =
    Http.BadPayload ""
        (Http.Response "fakeUrl" { code = 404, message = fakeErrorMessage } Dict.empty "")


suite : Test
suite =
    describe "Users module"
        [ describe "errorMessage"
            [ test "is a bad status err" <|
                \_ -> errorMessage badStatusError |> Expect.equal fakeErrorMessage
            , test "is a bad payload err" <|
                \_ -> errorMessage badPayloadError |> Expect.equal badPayloadErrorMessage
            , test "is a network err" <|
                \_ -> errorMessage Http.NetworkError |> Expect.equal networkErrorMessage
            , test "is a timeout err" <|
                \_ -> errorMessage Http.Timeout |> Expect.equal timeoutErrorMessage
            ]
        ]


suiteUI : Test
suiteUI =
    describe "Users module [HTML]"
        [ describe "userView"
            [ fuzz3 string string int "renders single user's `fname lname`" <|
                \fname lname age ->
                    userView (User fname lname age)
                        |> Query.fromHtml
                        |> Query.has [ tag "li", text (fname ++ " " ++ lname) ]
            ]
        , describe "searchView"
            [ test "has top level form with no autocomplete and pointing to /users" <|
                \_ ->
                    searchView ""
                        |> Query.fromHtml
                        |> Query.has [ attribute "action" "/users", attribute "autocomplete" "off" ]
            , fuzz string "has the right input search field with query inside and placeholder" <|
                \search ->
                    searchView search
                        |> Query.fromHtml
                        |> Query.find
                            [ tag "input"
                            , attribute "name" "search"
                            , attribute "type" "search"
                            , attribute "placeholder" "Search GOT"
                            ]
                        |> Query.has [ attribute "value" search ]
            ]
        , describe "errorView"
            [ test "is p with Error css class" <|
                \_ ->
                    errorView badStatusError
                        |> Query.fromHtml
                        |> Query.has [ tag "p", class "Error" ]
            ]
        , describe "usersView"
            [ test "is loading" <|
                \_ ->
                    usersView RemoteData.Loading
                        |> Query.fromHtml
                        |> Query.has [ text loadingText ]
            , test "has not started loading" <|
                \_ ->
                    usersView RemoteData.NotAsked
                        |> Query.fromHtml
                        |> Query.has [ text loadInstructionText ]
            , test "has failed" <|
                \_ ->
                    usersView (RemoteData.Failure badStatusError)
                        |> Query.fromHtml
                        |> Query.has [ tag "p" ]
            , fuzz3 (list string) (list string) (list int) "displays random users" <|
                \fnames lnames ages ->
                    let
                        users =
                            List.map3 (\fname lname age -> User fname lname age) fnames lnames ages

                        html =
                            usersView (RemoteData.Success users) |> Query.fromHtml
                    in
                        html
                            |> Expect.all
                                [ Query.has [ tag "ul", class "Users" ]
                                , Query.children [ tag "li" ] >> Query.count (Expect.equal <| List.length users)
                                ]
            ]
        , describe "main view"
            [ test "has a root div" <|
                \_ ->
                    view (Tuple.first (init { search = "", users = [] }))
                        |> Query.fromHtml
                        |> Query.has [ tag "div" ]
            ]
        ]
