import * as PropTypes from "prop-types";
import { useParams } from "react-router";
import "./BookingForm.scss";
import { useRef, useState, useEffect } from "react";
import LoadingImg from "../../assets/loading.gif";
import { ApiUtil } from "../../lib/apiUtil";
import { applyDateMask } from "../../lib/inputMaskUtil";

function debounceWithCancel(func, wait) {
  let timeout;
  let requestId = 0;
  let lastRequestId = 0;

  return function (...args) {
    const currentRequestId = ++requestId;

    const later = () => {
      lastRequestId = currentRequestId;
      func(currentRequestId, lastRequestId, ...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const validateDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

const validatePositiveNumber = (value) => {
  const num = parseInt(value, 10);
  return !isNaN(num) && num > 0;
};

const ERROR_MESSAGES = {
  invalidDate: "Please enter a valid check-in date in yyyy-mm-dd format.",
  invalidDuration: "Please enter a valid duration of stay (1 or more days).",
  invalidGuests: "Please enter a valid number of guests.",
  reservationFailed: "Failed to reserve the property. Please try again.",
};

export const onRequestedDatesChange = debounceWithCancel(function (
  currentRequestId,
  lastRequestId,
  propertyId,
  checkinDate,
  durationString,
  setShowAvailabilityError
) {
  if (!validateDate(checkinDate)) {
    return;
  }

  const duration = validatePositiveNumber(durationString)
    ? parseInt(durationString, 10)
    : 1;

  ApiUtil.checkAvailability(propertyId, checkinDate, duration)
    .then((isAvailable) => {
      if (currentRequestId !== lastRequestId) return;
      setShowAvailabilityError(!isAvailable);
    })
    .catch(() => {
      if (currentRequestId !== lastRequestId) return;
      setShowAvailabilityError(true);
    });
},
500);

const BookingForm = ({ rate }) => {
  const { propertyId } = useParams();

  const [formState, setFormState] = useState({
    checkinDate: "",
    duration: "",
    guests: "",
  });
  const [formStatus, setFormStatus] = useState({
    showAvailabilityError: false,
    loading: false,
    errorMessages: [],
    successMessage: "",
  });

  const checkinDateRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));

    if (formStatus.errorMessages.length > 0) {
      setFormStatus((prev) => ({
        ...prev,
        errorMessages: prev.errorMessages.filter((msg) => !msg.includes(field)),
      }));
    }
  };

  const handleDateChange = () => {
    if (checkinDateRef.current) {
      const formattedDate = applyDateMask(checkinDateRef.current);
      handleInputChange("checkinDate", formattedDate);
    }
  };

  const submitBooking = (event) => {
    event.preventDefault();

    setFormStatus((prev) => ({
      ...prev,
      successMessage: "",
      errorMessages: [],
    }));

    const errors = [];

    if (!validateDate(formState.checkinDate)) {
      errors.push(ERROR_MESSAGES.invalidDate);
    }

    if (!validatePositiveNumber(formState.duration)) {
      errors.push(ERROR_MESSAGES.invalidDuration);
    }

    if (!validatePositiveNumber(formState.guests)) {
      errors.push(ERROR_MESSAGES.invalidGuests);
    }

    if (errors.length > 0) {
      setFormStatus((prev) => ({ ...prev, errorMessages: errors }));
      return;
    }

    const reservationData = {
      checkinDate: formState.checkinDate,
      duration: parseInt(formState.duration, 10),
      guests: parseInt(formState.guests, 10),
    };

    setFormStatus((prev) => ({ ...prev, loading: true }));

    fetch(`/properties/${propertyId}/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Reservation failed");
        return response.json();
      })
      .then(() => {
        setFormStatus((prev) => ({
          ...prev,
          loading: false,
          successMessage: "Reservation successful!",
        }));
      })
      .catch(() => {
        setFormStatus((prev) => ({
          ...prev,
          loading: false,
          errorMessages: [ERROR_MESSAGES.reservationFailed],
        }));
      });
  };

  useEffect(() => {
    setFormStatus((prev) => ({ ...prev, showAvailabilityError: false }));
    onRequestedDatesChange(
      propertyId || "",
      formState.checkinDate,
      formState.duration,
      (show) =>
        setFormStatus((prev) => ({ ...prev, showAvailabilityError: show }))
    );
  }, [propertyId, formState.checkinDate, formState.duration]);

  return (
    <form
      className="booking-form"
      onSubmit={submitBooking}
      aria-labelledby="booking-form-title"
      noValidate
    >
      <h2 id="booking-form-title" className="sr-only">
        Book Your Stay
      </h2>

      <div className="booking-rate-section">
        <span className="booking-rate-amount" aria-label="Nightly rate">
          ${rate}
        </span>
        <span>/night</span>
      </div>

      <div className="booking-form-item">
        <label htmlFor="checkin-date" id="checkin-date-label">
          Check-in date
        </label>
        <input
          id="checkin-date"
          className="booking-form-input"
          type="text"
          value={formState.checkinDate}
          onChange={handleDateChange}
          ref={checkinDateRef}
          placeholder="yyyy-mm-dd"
          aria-required="true"
          aria-describedby="checkin-date-hint checkin-availability-error"
        />
        <small id="checkin-date-hint" className="booking-form-hint">
          Format: yyyy-mm-dd
        </small>
        {formStatus.showAvailabilityError && (
          <div
            id="checkin-availability-error"
            className="booking-form-error-msg"
            role="alert"
          >
            The specified dates are not available.
          </div>
        )}
      </div>

      <div className="booking-form-item">
        <label htmlFor="duration">Duration of stay (days)</label>
        <input
          id="duration"
          className="booking-form-input"
          type="number"
          min="1"
          value={formState.duration}
          onChange={(e) => handleInputChange("duration", e.target.value)}
          aria-required="true"
        />
      </div>

      <div className="booking-form-item">
        <label htmlFor="guests">Number of guests</label>
        <input
          id="guests"
          className="booking-form-input"
          type="number"
          min="1"
          value={formState.guests}
          onChange={(e) => handleInputChange("guests", e.target.value)}
          aria-required="true"
        />
      </div>

      {formStatus.errorMessages.length > 0 && (
        <div className="booking-form-error-msg" role="alert">
          {formStatus.errorMessages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      )}

      {formStatus.successMessage && (
        <div
          className="booking-form-success-msg"
          role="status"
          aria-live="polite"
        >
          {formStatus.successMessage}
        </div>
      )}

      <div>
        <button
          className="booking-form-submit"
          type="submit"
          disabled={formStatus.loading}
          aria-busy={formStatus.loading}
        >
          {formStatus.loading ? (
            <img
              src={LoadingImg}
              alt="Loading..."
              className="booking-form-loading-img"
            />
          ) : (
            "Reserve"
          )}
        </button>
      </div>
    </form>
  );
};

BookingForm.propTypes = {
  rate: PropTypes.number.isRequired,
};

export default BookingForm;
