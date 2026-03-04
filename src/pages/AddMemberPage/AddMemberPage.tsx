import { AlertCircle, UserPlus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import type { AddMemberFormState } from "../../types";
import { useEffect } from "react";
import SkillTagInput from "../../components/SkillTagInput/SkillTagInput";
import "./AddMemberPage.css";

export default function AddMember() {
  const addMemberForm = useForm<AddMemberFormState>({
    defaultValues: {
      memberName: "",
      memberId: "",
      memberExperience: 0,
      memberSkillset: [],
      memberDescription: "",
      projectStartDate: "",
      projectEndDate: "",
      memberAllocationPercentage: 0,
    },
    mode: "all",
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    reset: resetForm,
    trigger,
  } = addMemberForm;
  const { errors, isDirty, isValid, isSubmitSuccessful } = formState;
  const onSubmit = async (data: AddMemberFormState) => {
    console.log("Form Submitted Successfully", data);
    const response = await fetch("http://localhost:3001/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("Form Submitted Successfully mock", result);
  };
  useEffect(() => {
    if (isSubmitSuccessful) {
      resetForm();
    }
  }, [isSubmitSuccessful, resetForm]);
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__icon-wrap icon-bg-green">
          <UserPlus size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="page-header__title">Add Team Member</h2>
          <p className="page-header__subtitle">
            Register a new member with full profile details
          </p>
        </div>
      </div>
      <div className="add-member-grid">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card" style={{ marginBottom: "1rem" }}>
            <p className="form-section-title">Personal Details</p>
            <div className="form-row-2" style={{ marginBottom: "1rem" }}>
              <div>
                <label className="form-label" htmlFor="memberName">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="memberName"
                  className={`form-control${errors?.memberName?.message ? " is-invalid" : ""}`}
                  placeholder="Enter Member Name"
                  {...register("memberName", {
                    required: {
                      value: true,
                      message: "Member name is required",
                    },
                    minLength: {
                      value: 3,
                      message: "Member name must be at least 3 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Member name must be at most 50 characters",
                    },
                  })}
                />
                {errors?.memberName?.message && (
                  <p className="field-error">
                    <AlertCircle size={12} /> {errors?.memberName?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="memberId">
                  Member ID *
                </label>
                <input
                  id="memberId"
                  className={`form-control${errors?.memberId?.message ? " is-invalid" : ""}`}
                  placeholder="Enter Member ID"
                  {...register("memberId", {
                    required: {
                      value: true,
                      message: "Member ID is required",
                    },
                  })}
                />
                {errors?.memberId?.message && (
                  <p className="field-error">
                    <AlertCircle size={12} /> {errors?.memberId?.message}
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label" htmlFor="memberExperience">
                Years of Experience *
              </label>
              <input
                id="memberExperience"
                type="number"
                min={0}
                className={`form-control${errors?.memberExperience?.message ? " is-invalid" : ""}`}
                placeholder="Overall experience"
                {...register("memberExperience", {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: "Member experience is required",
                  },
                  min: {
                    value: 0,
                    message: "Member experience must be at least 0",
                  },
                  max: {
                    value: 50,
                    message: "Member experience must be at most 50",
                  },
                  validate: (value) => {
                    if (value <= 4) {
                      return "Member experience must be greater than 4";
                    }
                  },
                })}
                style={{ maxWidth: 200 }}
              />
              {errors?.memberExperience?.message && (
                <p className="field-error">
                  <AlertCircle size={12} /> {errors?.memberExperience?.message}
                </p>
              )}
            </div>

            <div>
              <label className="form-label" htmlFor="memberSkillset">
                Skillset *
              </label>
              <Controller
                name="memberSkillset"
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value || value.length === 0) {
                      return "Member skillset is required";
                    }
                    if (value.length < 3) {
                      return "Member skillset must have at least 3 skills";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <SkillTagInput
                    skills={field.value}
                    onChange={field.onChange}
                    isInvalid={!!errors?.memberSkillset?.message}
                  />
                )}
              />
              {errors?.memberSkillset?.message && (
                <p className="field-error">
                  <AlertCircle size={12} /> {errors?.memberSkillset?.message}
                </p>
              )}
            </div>

            <div>
              <label className="form-label" htmlFor="memberDescription">
                Profile Description *
              </label>
              <textarea
                id="memberDescription"
                rows={3}
                className={`form-control${errors?.memberDescription?.message ? " is-invalid" : ""}`}
                placeholder="Brief description of current role and experience"
                {...register("memberDescription", {
                  required: {
                    value: true,
                    message: "Member description is required",
                  },
                })}
              />
              {errors?.memberDescription?.message && (
                <p className="field-error">
                  <AlertCircle size={12} /> {errors?.memberDescription?.message}
                </p>
              )}
            </div>
          </div>
          <div className="form-card" style={{ marginBottom: "1rem" }}>
            <p className="form-section-title">Project Dates & Allocation</p>

            <div className="form-row-2" style={{ marginBottom: "1.25rem" }}>
              <div>
                <label className="form-label" htmlFor="projectStartDate">
                  Project Start Date *
                </label>
                <input
                  id="projectStartDate"
                  type="date"
                  className={`form-control${errors?.projectStartDate?.message ? " is-invalid" : ""}`}
                  {...register("projectStartDate", {
                    required: {
                      value: true,
                      message: "Project start date is required",
                    },
                    // pattern: {
                    //   value:
                    //     /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                    //   message:
                    //     "Project start date must be in DD/MM/YYYY format",
                    // },
                  })}
                />
                {errors?.projectStartDate?.message && (
                  <p className="field-error">
                    <AlertCircle size={12} />{" "}
                    {errors?.projectStartDate?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="projectEndDate">
                  Project End Date *
                </label>
                <input
                  id="projectEndDate"
                  type="date"
                  className={`form-control${errors?.projectEndDate?.message ? " is-invalid" : ""}`}
                  {...register("projectEndDate", {
                    required: {
                      value: true,
                      message: "Project end date is required",
                    },
                    // pattern: {
                    //   value:
                    //     /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                    //   message: "Project end date must be in DD/MM/YYYY format",
                    // },
                    validate: (value) => {
                      if (addMemberForm.getValues("projectStartDate") === "") {
                        trigger("projectStartDate");
                      }
                      const startDate = new Date(
                        addMemberForm.getValues("projectStartDate"),
                      );
                      const endDate = new Date(value);
                      if (endDate <= startDate) {
                        return "Project end date must be after project start date";
                      }
                    },
                  })}
                />
                {errors?.projectEndDate?.message && (
                  <p className="field-error">
                    <AlertCircle size={12} /> {errors?.projectEndDate?.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                className="form-label"
                htmlFor="memberAllocationPercentage"
              >
                Allocation Percentage
              </label>
              <input
                type="number"
                id="memberAllocationPercentage"
                min={0}
                max={100}
                className={`form-control${errors?.memberAllocationPercentage?.message ? " is-invalid" : ""}`}
                placeholder="Enter Allocation Percentage"
                {...register("memberAllocationPercentage", {
                  valueAsNumber: true,
                  required: {
                    value: true,
                    message: "Allocation percentage is required",
                  },
                  min: {
                    value: 0,
                    message: "Allocation percentage must be at least 0",
                  },
                  max: {
                    value: 100,
                    message: "Allocation percentage must be at most 100",
                  },
                  validate: (value) => {
                    if (value < 1 || value > 100) {
                      return "Allocation must be between 1% and 100%";
                    }
                  },
                })}
                style={{ maxWidth: 200 }}
              />
              {errors?.memberAllocationPercentage?.message && (
                <p className="field-error">
                  <AlertCircle size={12} />{" "}
                  {errors?.memberAllocationPercentage?.message}
                </p>
              )}
            </div>
          </div>

          <div className="form-submit-row">
            <button
              type="submit"
              className="btn-primary-custom"
              id="addMemberBtn"
              disabled={!isDirty || !isValid}
            >
              Add Member
            </button>
            <button
              type="button"
              className="btn-secondary-custom"
              onClick={() => {
                resetForm();
              }}
            >
              Reset
            </button>
          </div>
        </form>
        {/* <DevTool control={control} /> */}
      </div>
    </div>
  );
}
