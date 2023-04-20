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
  const [currentRound, setCurrentRound] = useState(null);
  const [totalRounds, setTotalRounds] = useState(null);
  const [spierId, setSpierId] = useState(null);
  const [hintFromServer, setHintFromServer] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [color, setColor] = useState(null);
  const [colorFromServer, setColorFromServer] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [stompClient, setStompClient] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const { userId } = useParams();

  const connect = async () => {
    var socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    setStompClient(client);
    setConnectionStatus("connected");

    client.connect({}, function () {
      //subscribe to spiedObject
      client.subscribe('/topic/games/'+ lobbyId + '/spiedObject', function (receivedJSON) {
        const colorFromServer = JSON.parse(receivedJSON.body).color;
        setColorFromServer(colorFromServer);
      });
      //subscribe to guesses
      client.subscribe('/topic/games/'+ lobbyId + '/guesses', function (receivedJSON) {
         const { username, guess } = JSON.parse(receivedJSON.body);
         showGuesses({ username, guess });
      });
      //subscribe to hints
      client.subscribe('/topic/games/'+ lobbyId + '/hints', function (receivedJSON) {
        const hintFromServer = JSON.parse(receivedJSON.body).hint;
        setHintFromServer(hintFromServer);
      });
      //subscribe to roles
      client.subscribe('/topic/games/'+ lobbyId + '/round/1/spierId', function (receivedJSON) {
        const spierId = JSON.parse(receivedJSON.body).userId;
        setSpierId(spierId);
      });
      //subscribe to roundNr
      client.subscribe('/topic/games/'+ lobbyId + '/roundnr', function (receivedJSON) {
        const currentRound = JSON.parse(receivedJSON.body).currentRound;
        setCurrentRound(currentRound);
        const totalRounds = JSON.parse(receivedJSON.body).totalRounds;
        setTotalRounds(totalRounds);
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
      stompClient.send("/app/games/"+ lobbyId+ "/spiedObject", {}, JSON.stringify({ "keyword" : keyword, "color": color }));
      setKeyword("");
      setColor("");
  };

  const sendGuess = async () => {
      stompClient.send("/app/games/"+ lobbyId + "/guesses", {}, JSON.stringify({ "id" : localStorage.getItem("userId"), "guess": guess }));
  };

  const sendHint = async () => {
      stompClient.send("/app/games/"+ lobbyId+ "/hints", {}, JSON.stringify({ "hint": hint }));
  };

  const requestSpierId = async () => {
      stompClient.send("/app/games/"+ lobbyId+ "/round/1/spierId", {}, {});
  };

  const requestRounds = async () => {
      stompClient.send("/app/games/"+ lobbyId+ "/roundnr", {}, {});
  };

  const showGuesses = async (guess) => {
    setGuesses(prevGuesses => [...prevGuesses, guess]);
  };

  return (
    <BaseContainer>
      <div style={{ display: "flex", alignItems: "center" }}>
        <p style={{ marginRight: "10px" }}>connect and subscribe </p>
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
      <button onClick={() => requestSpierId()}>get spier id</button>
      <p>Spier id: {spierId}</p>
      <button onClick={() => requestRounds()}>get round nr</button>
      <p>Current Round: {currentRound}</p>
      <p>Total Rounds: {totalRounds}</p>
    </BaseContainer>
  );
};

export default TestingGame;
