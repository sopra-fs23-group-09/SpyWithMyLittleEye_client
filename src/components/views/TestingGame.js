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
  const [guess, setGuess] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [stompClient, setStompClient] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const { userId } = useParams();


  // TEST SETUP:
  const handshake_address = "http://localhost:8080/ws";
  const channel = '/game/guesses';

  const connect = async () => {
    var socket = new SockJS(handshake_address);
    const client = Stomp.over(socket);
    setStompClient(client);
    setConnectionStatus("connecting");
    client.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      setConnectionStatus("connected");
      client.subscribe(channel, function (receivedGuessJSON) {
        const { username, guess } = JSON.parse(receivedGuessJSON.body);
        showGuesses({ username, guess });
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

  const sendGuess = async () => {
      stompClient.send("/app/guess", {}, JSON.stringify({ "id" : localStorage.getItem("id"), "guess": guess })); //"id" : userId, "guess": guess
  };


  const showGuesses = async (guess) => {
    setGuesses(prevGuesses => [...prevGuesses, guess]);
  };


  return (
    <BaseContainer>
      <p> connect and subscribe to {handshake_address}, channel: {channel} </p>
      <button onClick={() => connect()}>connect</button>
      <button onClick={() => disconnect()}>disconnect</button>
      <p>{connectionStatus}</p>
      <FormField
        label="guess"
        value={guess}
        onChange={gue => setGuess(gue)}
      />
      <button onClick={() => sendGuess()}>send Guess</button>
      <h4> guesses </h4>
      <p>
        {guesses.map((guess, index) => (
          <span key={index}>
            <b>{guess.username}</b> guessed {guess.guess} <br />
          </span>
        ))}
      </p>
    </BaseContainer>
  );
};

export default TestingGame;
