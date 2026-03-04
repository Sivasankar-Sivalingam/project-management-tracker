import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PieChart, AlertCircle } from "lucide-react";
import MemberSearch from "../../components/MemberSearch/MemberSearch";
import type { MemberData } from "../../types";
import "./AllocationPage.css";

function formatDate(iso: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  return isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function isProjectExpired(projectEndDate: string): boolean {
  return new Date(projectEndDate) < new Date();
}

export default function AllocationPage() {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup react-hook-form for the allocation input
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<{ memberAllocationPercentage: number }>({
    mode: "onChange",
  });

  useEffect(() => {
    fetch("http://localhost:3001/members")
      .then((res) => res.json())
      .then((data: MemberData[]) => setMembers(data))
      .catch(() => {});
  }, []);

  const handleInputChange = (value: string) => {
    setSearchInput(value);
    setSelectedMember(null);
    setShowWarning(false);
    setUpdateSuccess(false);
    setUpdateError(null);
  };

  const handleSelectMember = (member: MemberData) => {
    setSearchInput(`${member.memberName} (${member.memberId})`);
    setSelectedMember(member);
    setShowWarning(false);
    setUpdateSuccess(false);
    setUpdateError(null);
    // Pre-fill the input with the computed "New Allocation"
    setValue("memberAllocationPercentage", computeNewAllocation(member), {
      shouldValidate: true,
    });
  };

  // Derive the new allocation value default based on the business rule
  const computeNewAllocation = (member: MemberData): number =>
    isProjectExpired(member.projectEndDate) ? 0 : 100;

  const onSubmit = (data: { memberAllocationPercentage: number }) => {
    if (!selectedMember) return;
    const newAllocation = data.memberAllocationPercentage;
    // If allocation will be set to 0%, show a warning confirmation first
    if (newAllocation === 0) {
      setShowWarning(true);
    } else {
      submitAllocationUpdate(selectedMember, newAllocation);
    }
  };

  const submitAllocationUpdate = async (
    member: MemberData,
    newAllocation: number,
  ) => {
    setIsSubmitting(true);
    setShowWarning(false);
    setUpdateError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/members/${member.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberAllocationPercentage: newAllocation }),
        },
      );

      if (!response.ok) throw new Error();

      const updatedMember: MemberData = await response.json();
      setSelectedMember(updatedMember);
      setMembers((current) =>
        current.map((m) => (m.id === updatedMember.id ? updatedMember : m)),
      );
      setUpdateSuccess(true);
    } catch {
      setUpdateError("Failed to update allocation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch the current value in the input to determine if it changed
  const currentInputValue = watch("memberAllocationPercentage");
  const allocationAlreadyCurrent =
    selectedMember !== null &&
    selectedMember.memberAllocationPercentage === currentInputValue;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__icon-wrap icon-bg-red">
          <PieChart size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="page-header__title">Update Allocation</h2>
          <p className="page-header__subtitle">
            Search for a member to review and update their allocation
            percentage.
          </p>
        </div>
      </div>

      <MemberSearch
        id="allocationMemberSearch"
        members={members}
        value={searchInput}
        onChange={handleInputChange}
        onSelect={handleSelectMember}
        placeholder="Search by member name or ID…"
      />

      {/* Member allocation panel */}
      {selectedMember && (
        <form className="allocation-card" onSubmit={handleSubmit(onSubmit)}>
          <p className="info-card__title">Allocation Details</p>

          <div className="info-grid">
            <div className="info-field">
              <span className="info-label">Member Name</span>
              <span className="info-value">{selectedMember.memberName}</span>
            </div>
            <div className="info-field">
              <span className="info-label">Member ID</span>
              <span className="info-value cell-id">
                {selectedMember.memberId}
              </span>
            </div>
            <div className="info-field">
              <span className="info-label">Project End Date</span>
              <span className="info-value">
                {formatDate(selectedMember.projectEndDate)}
              </span>
            </div>
            <div className="info-field">
              <span className="info-label">Current Allocation</span>
              <span className="info-value info-value--accent">
                {selectedMember.memberAllocationPercentage}%
              </span>
            </div>
            <div className="info-field">
              <label
                className="info-label"
                htmlFor="memberAllocationPercentage"
              >
                New Allocation
              </label>
              <input
                type="number"
                id="memberAllocationPercentage"
                min={0}
                max={100}
                className={`form-control alloc-input${
                  errors.memberAllocationPercentage ? " is-invalid" : ""
                }`}
                placeholder="Enter %"
                {...register("memberAllocationPercentage", {
                  valueAsNumber: true,
                  required: "Allocation percentage is required",
                  min: { value: 0, message: "Must be at least 0" },
                  max: { value: 100, message: "Must be at most 100" },
                  validate: (value) => {
                    // We allow 0 if the project is expired (the business rule default)
                    if (
                      value === 0 &&
                      selectedMember &&
                      isProjectExpired(selectedMember.projectEndDate)
                    ) {
                      return true;
                    }
                    if (value < 1 || value > 100) {
                      return "Allocation must be between 1% and 100%";
                    }
                    return true;
                  },
                })}
              />
              {errors.memberAllocationPercentage && (
                <span className="field-error">
                  <AlertCircle size={12} />{" "}
                  {errors.memberAllocationPercentage.message}
                </span>
              )}
            </div>
          </div>

          {/* Warning banner: shown before confirming a 0% update */}
          {showWarning && (
            <div className="alloc-warning">
              <AlertCircle size={16} />
              <div>
                <p className="alloc-warning__text">
                  The project end date has passed. Allocation will be set to{" "}
                  <strong>0%</strong>. Do you want to proceed?
                </p>
                <div className="alloc-warning__actions">
                  <button
                    className="btn-danger-custom"
                    onClick={() => submitAllocationUpdate(selectedMember!, 0)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating…" : "Yes, set to 0%"}
                  </button>
                  <button
                    className="btn-secondary-custom"
                    onClick={() => setShowWarning(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success banner */}
          {updateSuccess && (
            <div className="alloc-success">
              Allocation updated to {selectedMember.memberAllocationPercentage}%
              successfully.
            </div>
          )}

          {/* API error */}
          {updateError && (
            <div className="task-error">
              <AlertCircle size={16} />
              {updateError}
            </div>
          )}

          {/* Update button — hidden while warning is shown */}
          {!showWarning && !updateSuccess && (
            <div className="alloc-actions">
              <button
                type="submit"
                id="updateAllocationBtn"
                className="btn-primary-custom"
                disabled={isSubmitting || allocationAlreadyCurrent || !isValid}
              >
                {isSubmitting ? "Updating…" : "Update Allocation"}
              </button>
              {allocationAlreadyCurrent && (
                <span className="alloc-hint">
                  Allocation is already up to date.
                </span>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
