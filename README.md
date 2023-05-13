# I Spy With My Little Eye

![Image](./src/components/ui/LogoEye.js)  TODO: LOGO

By translating the childhood-favorite to the web, I Spy With My Little Eye is an exciting game where you can explore the
world with your friends online.
Check out the back-end implementation [here](https://github.com/sopra-fs23-group-09/SpyWithMyLittleEye_server).

## 📚 Table of Contents

1. [✨ Introduction](#introduction)
2. [🦋 Technologies](#technologies)
3. [🧩 High-level Components](#high-level-components)
4. [🚀 Launch & Development](#launch--development)
5. [🖼️ Illustrations](#illustrations)
6. [🚗 Roadmap](#roadmap)
7. [👩‍💻 Authors](#authors)
8. [🫂 Acknowledgments](#acknowledgments)
9. [©️ License](#license)

## ✨ Introduction

I Spy With My Little Eye aims to rekindle childhood memories - Having an online version of this beloved game allows us
to explore the world with our friends online in a fun and exciting way.

## 🦋 Technologies

During the development of the front-end, we used the following technologies:

* [JavaScript]() - Programming language
* [REACT](https://reactjs.org/) - Front-end JavaScript Library used mainly for Hooks
* [MUI](https://mui.com/material-ui/react-alert/) - React UI framework used mainly for Alert components
* [Axios API](https://axios-http.com/docs/api_intro) - Used for REST-based communication with the server
* [Stomp](https://stomp-js.github.io/stomp-websocket/) - Used for websocket communication with the server

## 🧩 High-level Components (TODO)
Find the front-ends main 3 components below. What is their role?
How are they correlated? Reference the main class, file, or function in the README text
with a link.

### 📍 Set Location

[SetLocation](https://github.com/sopra-fs23-group-09/SpyWithMyLittleEye_client/blob/main/src/components/views/SetLocation.js)
allows this rounds **SPIER** to select a place on a map and entering the keyword and the color for an object they want
the **GUESSERs** to find in the StreetView of the picked location.
<br>
This View interacts with the Google Maps and StreetView API. It also fetches data about the current round from the
server via a REST GET request. Once the **SPIER** has confirmed their choice, it is sent
to the backend using the websocket. The **GUESSERs** in the Waiting Room are informed through a Websocket Channel
they are subscribed to, and redirected to the main part of the game: [Guessing](#-guessing).

### ⁉️ Guessing
[Guessing](https://github.com/sopra-fs23-group-09/SpyWithMyLittleEye_client/blob/main/src/components/views/Guessing.js)
is the view in which **GUESSERs** try to guess the object the **SPIER** picked in [SetLocation](#-set-location), and 
the **SPIER** gives the **GUESSERs** hints to help them guess the correct quicker. **GUESSERs** can see the guesses in a
chat.  <br>
The chat works through a websocket connection with the backend.

### 🫀 Keep Alive 
maybe?

## 🚀 Launch & Development

These are the steps a new developer joining the team would
have to take to get started with the application.

### Prerequisites

As the application is mainly written in JavaScript, downloading [Node.js](https://nodejs.org) is needed. All other
dependencies, including React, get installed with:

```npm install```

### Commands to build and run the project locally

Start the app with:

```npm run dev```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Notice that the page will reload if you make any edits. You will also see any lint errors in the console (use Google
Chrome).

### Tests

You can run the tests with `npm run test`.
This launches the test runner in an interactive watch mode. See the section
about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into a 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

### Build

Finally, `npm run build` builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance: the build is minified,
and the filenames include hashes.<br>

### External dependencies

Both the client and the server have to be running for the application to behave as expected.

### Releases

## 🖼️ Illustrations (TODO: insert pictures)

Below we will briefly describe and illustrate the main user flow of our interface. <br>
A new round starts with the **SPIER**  selecting a place on Google Maps and choosing a random object on the Street View
of that location. <br>
![Image](//) <br>
Afterwards, the **GUESSERs** try to guess the object within the time limit. Dduring the game, where incorrect guesses
are highlighted in red and correct ones in green. Correct guesses are not revealed to the other players, they just see
that a fellow player guessed correctly - so everyone can try to get it right!
<br>
![Image](//)

## 🚗 Roadmap

* *Hard game mode*: When one person guesses correctly, the round is over
* *More metrics*: Allow the leaderboard to be filterable by other metrics (f.ex. fasted guessed)
* *Edit profile picture*

## 👩‍💻 Authors

* [Loubna Dia-Eddine](https://github.com/Loubnadia) - client
* [Ana Thereza Schiemer](https://github.com/athzsc) - client
* [Xena Wacker](https://github.com/xayreen) - client
* [Nina Emmermann](https://github.com/ninanni) - server
* [Claudia Anna Narang-Keller](https://github.com/cnaran) - server

## 🫂 Acknowledgments

We want to thank our Teaching Assistant [Sheena Lang](https://github.com/SheenaGit) for guiding us through the course.
We also couldn't have made it without our ✨ceremonies✨ 🍣✨ 🍱 🫶 after each Milestone.

## ©️ License

This project is licensed under the GNU GPLv3 License. 

 