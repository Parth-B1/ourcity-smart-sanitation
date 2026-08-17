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

import {
  createReport,
  type ReportResponse,
} from "../../services/reportService";

function ReportForm() {
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<ReportResponse | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSubmitting(true);
    setSubmitError("");

    try {
      // Parse latitude/longitude from location string if available
      let latitude: number | undefined;
      let longitude: number | undefined;

      const coordMatch = location.match(
        /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/,
      );

      if (coordMatch) {
        latitude = parseFloat(coordMatch[1]);
        longitude = parseFloat(coordMatch[2]);
      }

      const response = await createReport({
        category: category || "Other",
        description: description || undefined,
        location: location,
        latitude,
        longitude,
      });

      setResult(response);
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Unable to submit report. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && result) {
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
          <strong>{result.report_code}</strong>
        </div>

        {result.ai_category && (
          <div className="ai-result">
            <div className="ai-result-icon">
              <Sparkles size={20} />
            </div>

            <div className="ai-result-content">
              <div className="ai-result-title">
                <span>AI ANALYSIS</span>
                <strong>
                  {result.ai_confidence
                    ? `${Math.round(result.ai_confidence * 100)}% confidence`
                    : ""}
                </strong>
              </div>

              <h3>{result.ai_category} detected</h3>

              <p>{result.ai_reasoning}</p>

              <div className="severity">
                <AlertTriangle size={15} />
                <span>
                  Priority: {result.priority.charAt(0).toUpperCase() + result.priority.slice(1)}
                </span>
              </div>
            </div>
          </div>
        )}

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
          }}
        />
      </div>

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

      {submitError && (
        <div className="route-error">
          <strong>Submission failed</strong>
          <span>{submitError}</span>
        </div>
      )}

      <button
        type="submit"
        className="submit-report-button"
        disabled={!image || !location || submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="spin" size={18} />
            Submitting...
          </>
        ) : (
          <>
            <Send size={18} />
            Submit Report
          </>
        )}
      </button>
    </form>
  );
}

export default ReportForm;