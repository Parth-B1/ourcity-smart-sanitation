import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Send,
  Sparkles,
} from "lucide-react";

import ImageUpload from "./ImageUpload";
import LocationPicker from "./LocationPicker";

function ReportForm() {
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const analyzeWaste = () => {
    if (!image) return;

    setAnalyzing(true);
    setAnalyzed(false);

    // Temporary frontend simulation.
    // Later this will call backend AI.
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);

      if (!category) {
        setCategory("Mixed household waste");
      }
    }, 1500);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="report-success">
        <div className="success-icon">
          <CheckCircle2 size={38} />
        </div>

        <span className="eyebrow">REPORT SUBMITTED</span>

        <h2>Thank you for keeping our city clean.</h2>

        <p>
          Your report has been registered. The sanitation team can now
          review and prioritize this issue.
        </p>

        <div className="ticket-number">
          <span>Report ID</span>
          <strong>OS-2026-00842</strong>
        </div>

        <button
          type="button"
          className="submit-report-button"
          onClick={() => window.location.reload()}
        >
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-section-heading">
          <span>01</span>

          <div>
            <h2>Add a photo</h2>
            <p>Show us the waste problem.</p>
          </div>
        </div>

        <ImageUpload
          onImageChange={(file) => {
            setImage(file);
            setAnalyzed(false);
          }}
        />

        {image && !analyzed && (
          <button
            type="button"
            className="ai-analyze-button"
            onClick={analyzeWaste}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <Loader2 className="spin" size={18} />
                AI is analyzing...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Analyze with AI
              </>
            )}
          </button>
        )}
      </div>

      {analyzed && (
        <div className="ai-result">
          <div className="ai-result-icon">
            <Sparkles size={20} />
          </div>

          <div className="ai-result-content">
            <div className="ai-result-title">
              <span>AI ANALYSIS</span>
              <strong>98% confidence</strong>
            </div>

            <h3>Mixed household waste detected</h3>

            <p>
              The system identified a potential sanitation issue requiring
              collection attention.
            </p>

            <div className="severity">
              <AlertTriangle size={15} />
              <span>Priority: High</span>
            </div>
          </div>
        </div>
      )}

      <div className="form-section">
        <div className="form-section-heading">
          <span>02</span>

          <div>
            <h2>Where is it?</h2>
            <p>Help the sanitation team find the location.</p>
          </div>
        </div>

        <LocationPicker onLocationChange={setLocation} />
      </div>

      <div className="form-section">
        <div className="form-section-heading">
          <span>03</span>

          <div>
            <h2>Tell us more</h2>
            <p>Add information that could help resolve the issue.</p>
          </div>
        </div>

        <label className="form-label">
          Waste category

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Select category</option>
            <option value="Household waste">Household waste</option>
            <option value="Plastic waste">Plastic waste</option>
            <option value="Construction debris">
              Construction debris
            </option>
            <option value="Overflowing bin">Overflowing bin</option>
            <option value="Illegal dumping">Illegal dumping</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="form-label">
          Description

          <textarea
            placeholder="Describe what you found..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
          />
        </label>
      </div>

      <button
        type="submit"
        className="submit-report-button"
        disabled={!image || !location}
      >
        <Send size={18} />
        Submit Report
      </button>
    </form>
  );
}

export default ReportForm;