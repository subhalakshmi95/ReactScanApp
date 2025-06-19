import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

function ScanDetails(props: any) {
  interface scanNotes {
    title: string;
    content: string;
  }
  const scanId = props.scanData;
  const [show, setShow] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleClose = () => {
    setShow(false);
    setTitle("");
    setContent("");
  };

  const handleShow = () => setShow(true);

  const [scanList, setScanList] = useState({
    scanID: 0,
    scanType: "",
    findings: "",
    date: new Date(),
    notes: [{ title: "", content: "" }],
    anatomicalRegion: "",
  });
  const [loading, setLoading] = useState(false);

  const getScanDetails = async () => {
    try {
      const response = await fetch(
        "https://localhost:7105/api/scans/" + scanId + "/notes"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setScanList(await data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scanId == 0) {
      return;
    }
    setLoading(true);
    const getScanList = async () => {
      getScanDetails();
    };

    getScanList();
  }, [scanId]);

  function handleSubmit(event: any) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    newNotes(scanId);
    const formJson = Object.fromEntries(formData.entries());
  }

  const newNotes = async (scanId: number) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, content: content }),
    };
    const response = await fetch(
      "https://localhost:7105/api/scans/" + scanId + "/notes",
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response}`);
    }
    getScanDetails();
    handleClose();
  };

  if (loading && scanId != 0) return <div>Loading user data...</div>;

  return (
    <div>
      <div>
        <Button
          className="addNoteButton"
          variant="primary"
          onClick={handleShow}
        >
          Add Notes
        </Button>
        <span className="scanHeading">Scan Id :</span>
        <p>{scanList.scanID}</p>
      </div>

      <div>
        <span className="scanHeading">Scan Type :</span>
        <p>{scanList.scanType}</p>
      </div>

      <div>
        <span className="scanHeading">Scan Date :</span>
        <p>{new Date(scanList.date).toLocaleDateString()}</p>
      </div>
      <div>
        <span className="scanHeading">Anatomical Region :</span>
        <p>{scanList.anatomicalRegion}</p>
      </div>
      <div>
        <span className="scanHeading">Findings :</span>
        <p>{scanList.findings}</p>
      </div>

      <div>
        <div>
          <span className="scanHeading">Notes :</span>
        </div>
        {scanList.notes.map((note: scanNotes) => (
          <div key={note.title}>
            <span className="scanHeading">{note.title} </span> :
            <p>{note.content}</p>
          </div>
        ))}
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <div>
                  <label className="addNotelabel">
                    <div className="scanHeading addNoteHeaderWidth">Title:</div>
                    <input
                      name="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </label>
                  <label className="addNotelabel">
                    <span className="scanHeading addNoteHeaderWidth">
                      Content:
                    </span>
                    <textarea
                      name="Content"
                      rows={4}
                      cols={40}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div>
                  <Button
                    className="saveButton"
                    variant="primary"
                    type="submit"
                    value="submit"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        </>
      </div>
    </div>
  );
}

export default ScanDetails;
