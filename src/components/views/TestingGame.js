import React, { useState, useEffect } from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory, useParams } from 'react-router-dom';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/FormField"
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const TestingGame = props => {
  const history = useHistory();
  const [lobbyId, setLobbyId] = useState(1);
  const [guess, setGuess] = useState(null);
  const [hint, setHint] = useState(null);
  const [hintFromServer, setHintFromServer] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [color, setColor] = useState(null);
  const [colorFromServer, setColorFromServer] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [stompClient, setStompClient] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const { userId } = useParams();

  const handshake_address = "http://localhost:8080/ws";
  const channel_guesses = '/game/'+ lobbyId +  '/guesses';
  const channel_spiedObject = '/game/'+ lobbyId +  '/spiedObject';
  const channel_hints = '/game/'+ lobbyId +  '/hints';

  const connect = async () => {
    var socket = new SockJS(handshake_address);
    const client = Stomp.over(socket);
    setStompClient(client);
    setConnectionStatus("connected");

    client.connect({}, function () {
      //subscribe to spiedObject
      client.subscribe(channel_spiedObject, function (receivedSpiedObjectJSON) {
        const colorFromServer = JSON.parse(receivedSpiedObjectJSON.body).color;
        setColorFromServer(colorFromServer);
      });
      //subscribe to guesses
      client.subscribe(channel_guesses, function (receivedGuessJSON) {
         const { username, guess } = JSON.parse(receivedGuessJSON.body);
         showGuesses({ username, guess });
      });
      //subscribe to hints
      client.subscribe(channel_hints, function (receivedSpiedObjectJSON) {
        const hintFromServer = JSON.parse(receivedSpiedObjectJSON.body).hint;
        setHintFromServer(hintFromServer);
      });

    }, function(error) {
      console.log(error);
      setConnectionStatus("error");
    });
  };

  const disconnect = async () => {
      if (stompClient !== null) {
          stompClient.disconnect();
      }
      setConnectionStatus("disconnected");
  };

  const sendspiedObject = async () => {
      stompClient.send("/app/game/"+ lobbyId+ "/spiedObject", {}, JSON.stringify({ "keyword" : keyword, "color": color }));
  };

  const sendGuess = async () => {
      stompClient.send("/app/game/"+ lobbyId+ "/guesses", {}, JSON.stringify({ "id" : localStorage.getItem("id"), "guess": guess }));
  };

  const sendHint = async () => {
      stompClient.send("/app/game/"+ lobbyId+ "/hints", {}, JSON.stringify({ "hint": hint }));
  };

  const showGuesses = async (guess) => {
    setGuesses(prevGuesses => [...prevGuesses, guess]);
  };

  return (
    <BaseContainer>
      <div style={{ display: "flex", alignItems: "center" }}>
        <p style={{ marginRight: "10px" }}>connect and subscribe to {handshake_address}, channels: {channel_guesses}, {channel_spiedObject}</p>
        <button onClick={() => connect()} style={{ marginRight: "10px" }}>connect</button>
        <button onClick={() => disconnect()}>disconnect</button>
        <p> => {connectionStatus}</p>
      </div>
      <label>
        lobbyId:
        <input type="text" value={lobbyId} onChange={event => setLobbyId(event.target.value)} />
      </label>
      <p></p>
      <label>
        Keyword:
        <input type="text" value={keyword} onChange={event => setKeyword(event.target.value)} />
      </label>
      <label>
        Color:
        <input type="text" value={color} onChange={event => setColor(event.target.value)} />
      </label>
      <button onClick={() => sendspiedObject()}>send info spied object</button>
      <p>Color: {colorFromServer}</p>
      <label>
        Guess:
        <input type="text" value={guess} onChange={event => setGuess(event.target.value)} />
      </label>
      <button onClick={() => sendGuess()}>send Guess</button>
      <h4> guesses </h4>
      <p>
        {guesses.map((guess, index) => (
          <span key={index}>
            <b>{guess.username}</b> guessed {guess.guess} <br />
          </span>
        ))}
      </p>
      <label>
        Hint:
        <input type="text" value={hint} onChange={event => setHint(event.target.value)} />
      </label>
      <button onClick={() => sendHint()}>send hint</button>
      <p>Hint: {hintFromServer}</p>
    </BaseContainer>
  );
};

export default TestingGame;
