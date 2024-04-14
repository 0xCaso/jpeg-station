import logo from "../assets/logo-black.svg";

const Footer = () =>{
  return(
    <footer className="footer mt-20">
      <div className="container-fluid py-2" style={{backgroundColor: "#C7FF02", color: "#000"}}>
        <div className="row">
          <div className="col-4 text-center align-middle">
          <a href="/" style={{ color: "#000", fontFamily: "Space Grotesk Variable", display: "flex", lineHeight: 1, alignItems: "center" }}>
            <img src={logo} alt="Near" height="40" className="d-inline-block" />
            <p className="mb-0 h-fit"><b>JPEG</b> station</p>
          </a>
          </div>
          <div className="col-4 text-center align-middle mt-2">
            <a href="https://github.com/0xcaso/jpeg-station" target="_blank" style={{color: "#000"}}>
              Github
            </a>
          </div>
          <div className="col-4 text-center align-middle mt-2">
            <a href="https://youtu.be/ja9H6q82f4c?si=cbi2dBjNXf2__3hA" target="_blank" style={{color: "#000"}}>
              Video demo
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
  

export default Footer;