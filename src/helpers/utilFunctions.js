import Bear from "../images/Bear.png";
import Budgie from "../images/Budgie.png";
import Bunny from "../images/Bunny.png";
import Cockatoo from "../images/Cockatoo.png";
import Icebear from "../images/Icebear.png";
import Owl from "../images/Owl.png";
import Panda from "../images/Panda.png";
import Penguin from "../images/Penguin.png";
import RedPanda from "../images/RedPanda.png";
import Sloth from "../images/Sloth.png";
import {api, getErrorMessage} from "./api";
import {disconnect} from "./stompClient";

let token = localStorage.getItem("token");
export const getProfilePic = (pp_name) => {
    // TODO get profile picture
    let picture = "";
    switch (pp_name) {
        case 'Bear':
            picture = Bear;
            break;
        case 'Budgie':
            picture = Budgie;
            break;
        case 'Bunny':
            picture = Bunny;
            break;
        case 'Cockatoo':
            picture = Cockatoo;
            break;
        case 'Icebear':
            picture = Icebear;
            break;
        case 'Owl':
            picture = Owl;
            break;
        case 'Panda':
            picture = Panda;
            break;
        case 'Penguin':
            picture = Penguin;
            break;
        case 'RedPanda':
            picture = RedPanda;
            break;
        case 'Sloth':
            picture = Sloth;
            break;
        default:
            picture = RedPanda;
            console.log(`Profile Picture not defined, using default.`);
    }
    return picture;
}

export const logout = async () => {
    try {
        const title = {title: 'logout request'};
        await api.put('/users/logout', title, {headers: {Token: token}});
        console.log("Logout successful");

        console.log("I am no longer alive....")
        clearInterval(parseInt(localStorage.getItem('intervalId')));

        disconnect();

        console.log("I am deleting from localStorage...")
        localStorage.removeItem("location");
        localStorage.removeItem("color");
        localStorage.removeItem("lobbyId");
        localStorage.removeItem("gameId");
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('duration');
        localStorage.removeItem('intervalId');

        const audio = new Audio('https://drive.google.com/uc?export=download&id=1U_EAAPXNgmtEqeRnQO83uC6m4bbVezsF');
        await audio.play();
        return "Success";
    } catch (error) {
        let msg = getErrorMessage(error);
        return msg;
    }
}