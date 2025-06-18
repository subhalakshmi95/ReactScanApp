import ScanList from "./Components/ScanList";
import "./App.css";
import ScanDetails from "./Components/ScanDetails";
import { useState } from "react";
import logo from "./assets/Singular-Health.svg";

function app() {
  const [scanId, setScanId] = useState(0);

  const handleDataFromChild = (data: any) => {
    setScanId(data);
  };

  return (
    <div>
      <div className="primary">
        <a
          href="https://singular.health/"
          className="site-logo-container"
          rel="home"
          target="_blank"
        >
          <img
            src={logo}
            className="default-logo"
            alt="Singular Health logo."
          />
        </a>
      </div>
      <div className="app-layout">
        <div className="sidebar">
          <ScanList sendScanId={handleDataFromChild}></ScanList>
        </div>
        <div className="mainmenu">
          <ScanDetails scanData={scanId}></ScanDetails>
        </div>
      </div>
    </div>
  );
}

export default app;
