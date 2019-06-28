module Main exposing (Model, Msg(..), init, main, update, view)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Url



---- MODEL ----


type alias Model =
    { key : Nav.Key
    , url : Url.Url
    }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init () url key =
    ( Model key url, Cmd.none )



---- UPDATE ----


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External url ->
                    ( model, Nav.load url )

        UrlChanged url ->
            ( { model | url = url }, Cmd.none )



---- VIEW ----


view : Model -> Browser.Document Msg
view model =
    { title = "Url Interceptor" ++ "-" ++ Url.toString model.url
    , body =
        [ debugUI False
        , nav [ class "navbar" ]
            [ div [ class "navbar-menu" ]
                [ a [ class "navbar-item" ] [ text "Home" ]
                , a [ class "navbar-item" ] [ text "About" ]
                ]
            ]
        , section [ class "hero is-primary is-large" ]
            [ div [ class "hero-body" ]
                [ div [ class "container" ]
                    [ h1 [ class "title" ]
                        [ text "Elm!" ]
                    , h2
                        [ class "subtitle" ]
                        [ text "A delightful language to build performant and reliable apps with ZERO runtime exceptions." ]
                    ]
                ]
            ]
        ]
    }



---- PROGRAM ----


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = always Sub.none
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }


debugUI : Bool -> Html msg
debugUI enabled =
    let
        debug_style =
            case enabled of
                True ->
                    """
                    :not(path):not(g){color:hsla(210,100%,100%,.9)!important;background:hsla(210,100%,50%,.5)!important;outline:solid .25rem hsla(210,100%,100%,.5)!important;box-shadow:none!important}
                    """

                False ->
                    ""
    in
    Html.node "style" [] [ text debug_style ]
