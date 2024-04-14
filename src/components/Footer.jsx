import logo from "../assets/logo-black.svg";

const Footer = () =>{
  return(
    <footer className="footer">
      <div className="container-fluid py-2" style={{backgroundColor: "#C7FF02", color: "#000"}}>
        <div className="row">
          <div className="col-4 text-center align-middle">
            <a href="/">
              <img src={logo} alt="Near" height="40" className="d-inline-block" />
            </a>
          </div>
          <div className="col-4 text-center align-middle mt-2">
            <a href="https://github.com/0xcaso/ethdam-2024" target="_blank" style={{color: "#000"}}>
              Github
            </a>
          </div>
          <div className="col-4 text-center align-middle mt-2">
            <a href="https://youtube.com/" target="_blank" style={{color: "#000"}}>
              Video demo
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
  

export default Footer;