import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";


export const UserPageGuard = props => {
  if (localStorage.getItem("token")) {
    return props.children;
  }
  return <Redirect to="/login"/>;
};

UserPageGuard.propTypes = {
  children: PropTypes.node
};