import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Modals.css";
import "../../Responsive.css";

function Print({ open, onClose, groupedCandidates, voteCounts }) {
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Vote Summary", 10, 10);

    let currentY = 20; // Start position for tables

    Object.keys(groupedCandidates).forEach((position, index) => {
      const positionTitle = `${position.toUpperCase()}`;

      // Check if there's enough space on the current page for the title + table
      if (currentY + 1 > doc.internal.pageSize.height - 20) {
        doc.addPage(); // Add a new page if there's no space left
        currentY = 20; // Reset Y position for the new page
      }

      // Add position title
      doc.setFontSize(14);
      // doc.text(positionTitle, 10, currentY);
      currentY += 1; // Move Y down for the table

      // Create rows for the table
      const tableData = groupedCandidates[position].map((candidate) => {
        const candidateVoteData = voteCounts[candidate.candidateID] || {};
        const totalVotes =
          (candidateVoteData.BSIT || 0) +
          (candidateVoteData.BSCS || 0) +
          (candidateVoteData.BSCA || 0) +
          (candidateVoteData.BSBA || 0) +
          (candidateVoteData.BSHM || 0) +
          (candidateVoteData.BSTM || 0) +
          (candidateVoteData.BSED || 0) +
          (candidateVoteData.BSE || 0) +
          (candidateVoteData.BSPSY || 0) +
          (candidateVoteData.BSCRIM || 0);

        return [candidate.name, totalVotes];
      });

      // Add the table to the PDF
      doc.autoTable({
        head: [[positionTitle, "Total Votes"]], // Use positionTitle dynamically
        body: tableData,
        startY: currentY,
        didDrawPage: (data) => {
          // Update currentY for the next table
          currentY = data.cursor.y + 10; // Add spacing after the table
        },
        margin: { left: 10, right: 10 }, // Adjust margins to fit more content
      });

      // Check if there's still space for another title; if not, add a new page
      if (currentY > doc.internal.pageSize.height - 20) {
        doc.addPage();
        currentY = 20;
      }
    });

    // Save the PDF
    doc.save("VoteSummary.pdf");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="confirmVoteContainer">
        <DialogTitle className="confirmTitle">Vote Summary</DialogTitle>
        <DialogContent>
          {Object.keys(groupedCandidates).map((position) => (
            <TableContainer
              component={Paper}
              key={position}
              sx={{ marginBottom: 2 }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <strong>{position.toUpperCase()}</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedCandidates[position].map((candidate) => {
                    const candidateVoteData =
                      voteCounts[candidate.candidateID] || {};

                    const totalVotes =
                      (candidateVoteData.BSIT || 0) +
                      (candidateVoteData.BSCS || 0) +
                      (candidateVoteData.BSCA || 0) +
                      (candidateVoteData.BSBA || 0) +
                      (candidateVoteData.BSHM || 0) +
                      (candidateVoteData.BSTM || 0) +
                      (candidateVoteData.BSED || 0) +
                      (candidateVoteData.BSE || 0) +
                      (candidateVoteData.BSPSY || 0) +
                      (candidateVoteData.BSCRIM || 0);

                    return (
                      <TableRow key={candidate.candidateID}>
                        <TableCell>{candidate.name}</TableCell>
                        <TableCell>{totalVotes}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ))}
        </DialogContent>
        <DialogActions>
          <div className="confirmVoteBtns">
            <Button
              className="confirmBtns"
              type="submit"
              variant="outlined"
              onClick={onClose}
              sx={{
                marginTop: "10px",
              }}
            >
              Close
            </Button>
            <Button
              className="confirmBtns"
              type="submit"
              variant="contained"
              onClick={handleDownload}
              sx={{
                backgroundColor: "#1ab394",
                marginTop: "10px",
              }}
            >
              Download
            </Button>
          </div>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default Print;
