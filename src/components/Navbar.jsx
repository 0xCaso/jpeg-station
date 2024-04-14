import logo from "../assets/logo-white.svg";
import PropTypes from 'prop-types';
import { Wallet } from "../services/near-wallet";

const  Navbar = ({wallet, isSignedIn}) =>{
    const signIn = () => { wallet.signIn() }
    const signOut = () => { wallet.signOut() }
    return( <nav className="navbar">
    <div className="container-fluid navbar-expand-lg bg-black py-2">
      <a href="/">
        <img src={logo} alt="Near" height="40" className="d-inline-block align-text-top" />
      </a>
      <div className='navbar-nav pt-1'>
        {isSignedIn
          ? <button  className="btn btn-secondary" style={{ backgroundColor: "#C7FF02", color: "#000" }} onClick={signOut}>Logout {wallet.accountId}</button>
          : <button className="btn btn-secondary" style={{ backgroundColor: "#C7FF02", color: "#000" }} onClick={signIn}>Login</button>
        }
      </div>
    </div>
  </nav>)
}

Navbar.propTypes = {
    wallet: PropTypes.instanceOf(Wallet),
    isSignedIn: PropTypes.bool.isRequired,
  };
  

export default Navbar;