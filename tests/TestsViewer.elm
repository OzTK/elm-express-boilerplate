module TestsViewer exposing (..)

import Test.Runner.Html exposing (..)
import Test
import UsersTest


main : TestProgram
main =
    run <| Test.concat [ UsersTest.suite, UsersTest.suiteUI ]
