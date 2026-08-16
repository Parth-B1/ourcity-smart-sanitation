import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import ReportForm from "../components/citizen/ReportForm";

function Report() {
  return (
    <div className="app">
      <Navbar />

      <main className="report-page">
        <div className="report-container">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="report-header">
            <div>
              <span className="eyebrow">CITIZEN REPORT</span>

              <h1>Report a waste problem.</h1>

              <p>
                Help your city respond faster. Upload a photo, share the
                location, and our system will help prioritize the issue.
              </p>
            </div>

            <div className="privacy-note">
              <ShieldCheck size={18} />
              <span>Your information is handled securely.</span>
            </div>
          </div>

          <ReportForm />
        </div>
      </main>
    </div>
  );
}

export default Report;