import { Component } from "react";
import "..//App.css";

interface MyComponentProps {
  sendScanId: (data: any) => void;
}

interface MyComponentState {
  selectedIndex: number;
  patientData: patientScanList[];
  scanDetail: patientScanList;
}

interface scanNotes {
  title: string;
  content: string;
}

interface patientScanList {
  scanID: number;
  scanType: string;
  date: Date;
  anatomicalRegion: string;
  findings: string;
  notes: scanNotes[];
}

export class ScanList extends Component<MyComponentProps, MyComponentState> {
  constructor(props: MyComponentProps) {
    super(props);
    this.state = {
      selectedIndex: 0,
      patientData: [],
      scanDetail: {
        scanID: 0,
        scanType: "",
        findings: "",
        date: new Date(),
        notes: [{ title: "", content: "" }],
        anatomicalRegion: "",
      },
    };
  }

  componentDidMount(): void {
    this.fetchData();
  }

  async fetchData() {
    try {
      const response = await fetch("https://localhost:7105/api/scans");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.setState({ patientData: data });
      this.sendScanId(data[0].scanID);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  setSelectedIndex = (index: number) => {
    this.setState({ selectedIndex: index });
  };

  sendScanId = (scanID: number) => {
    this.props.sendScanId(scanID);
  };

  render() {
    return (
      <div className="leftnav">
        <h5>Patient Scan List</h5>
        {this.state.patientData.length === 0 && <p>No data found!!</p>}
        <ul className="list-group">
          {this.state.patientData.map(
            (scanData: patientScanList, index: number) => (
              <li
                key={scanData.scanID}
                className={
                  index == this.state.selectedIndex
                    ? "list-group-item active"
                    : "list-group-item"
                }
                onClick={() => {
                  this.setSelectedIndex(index);
                  this.sendScanId(scanData.scanID);
                }}
              >
                {scanData.scanID}
              </li>
            )
          )}
        </ul>
      </div>
    );
  }
}

export default ScanList;
