import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CheckSquare, AlertCircle } from "lucide-react";
import { useSanitize } from "../../hooks/useSanitize";
import type { MemberData, TaskFormState } from "../../types";
import "./AssignTaskPage.css";
import { useState } from "react";

export default function AssignTaskPage() {
  const { sanitizeFields } = useSanitize();
  const [members, setMembers] = useState<MemberData[]>([]);

  const assignTaskForm = useForm<TaskFormState>({
    defaultValues: {
      memberName: "",
      memberId: "",
      taskName: "",
      deliverables: "",
      taskStartDate: "",
      taskEndDate: "",
    },
    mode: "all",
  });

  const {
    register,
    handleSubmit,
    formState,
    reset: resetForm,
    setValue,
    getValues,
    watch,
  } = assignTaskForm;

  const { errors, isDirty, isValid, isSubmitSuccessful } = formState;

  const selectedMemberName = watch("memberName");
  const selectedMember =
    members.find((member) => member.memberName === selectedMemberName) ?? null;

  useEffect(() => {
    fetch("http://localhost:3001/members")
      .then((response) => response.json())
      .then((data: MemberData[]) => setMembers(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isSubmitSuccessful) resetForm();
  }, [isSubmitSuccessful, resetForm]);

  const handleMemberSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const memberName = event.target.value;
    const matchedMember = members.find(
      (member) => member.memberName === memberName,
    );
    setValue("memberName", memberName, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("memberId", matchedMember?.memberId ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (formData: TaskFormState) => {
    const sanitizedData = sanitizeFields(formData, [
      "taskName",
      "deliverables",
    ]);
    await fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sanitizedData, history: [] }),
    });
    console.log("taskData", sanitizedData);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__icon-wrap icon-bg-green">
          <CheckSquare size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="page-header__title">Assign Task</h2>
          <p className="page-header__subtitle">
            Assign a task to a team member with date validation.
          </p>
        </div>
      </div>

      <div className="assign-task-grid">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card">
            <p className="form-section-title">Member</p>
            <div className="form-row-2" style={{ marginBottom: "1rem" }}>
              <div>
                <label className="form-label" htmlFor="memberName">
                  Member Name *
                </label>
                <select
                  id="memberName"
                  className={`form-control${errors.memberName ? " is-invalid" : ""}`}
                  {...register("memberName", {
                    required: "Please select a team member.",
                  })}
                  onChange={handleMemberSelect}
                >
                  <option value="">Select a member</option>
                  {members.map((member) => (
                    <option key={member.memberId} value={member.memberName}>
                      {member.memberName}
                    </option>
                  ))}
                </select>
                {errors.memberName && (
                  <p className="field-error">
                    <AlertCircle size={12} /> {errors.memberName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="memberId">
                  Member ID
                </label>
                <input
                  id="memberId"
                  className="form-control"
                  readOnly
                  placeholder="Auto-filled on selection"
                  {...register("memberId")}
                />
              </div>
            </div>

            {selectedMember && (
              <p className="project-end-hint">
                Member project ends on:{" "}
                <strong>{selectedMember.projectEndDate}</strong> — task end date
                cannot exceed this.
              </p>
            )}
          </div>

          <div className="form-card">
            <p className="form-section-title">Task Details</p>

            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label" htmlFor="taskName">
                Task Name *
              </label>
              <input
                id="taskName"
                className={`form-control${errors.taskName ? " is-invalid" : ""}`}
                placeholder="e.g. Build Dashboard UI"
                {...register("taskName", {
                  required: "Task name is required.",
                })}
              />
              {errors.taskName && (
                <p className="field-error">
                  <AlertCircle size={12} /> {errors.taskName.message}
                </p>
              )}
            </div>

            <div>
              <label className="form-label" htmlFor="deliverables">
                Deliverables *
              </label>
              <textarea
                id="deliverables"
                rows={3}
                className={`form-control${errors.deliverables ? " is-invalid" : ""}`}
                placeholder="Describe the expected deliverables for this task"
                {...register("deliverables", {
                  required: "Deliverables are required.",
                })}
              />
              {errors.deliverables && (
                <p className="field-error">
                  <AlertCircle size={12} /> {errors.deliverables.message}
                </p>
              )}
            </div>
          </div>

          <div className="form-card">
            <p className="form-section-title">Task Dates</p>
            <div className="form-row-2">
              <div>
                <label className="form-label" htmlFor="taskStartDate">
                  Task Start Date *
                </label>
                <input
                  id="taskStartDate"
                  type="date"
                  className={`form-control${errors.taskStartDate ? " is-invalid" : ""}`}
                  {...register("taskStartDate", {
                    required: "Task start date is required.",
                  })}
                />
                {errors.taskStartDate && (
                  <p className="field-error">
                    <AlertCircle size={12} /> {errors.taskStartDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="taskEndDate">
                  Task End Date *
                </label>
                <input
                  id="taskEndDate"
                  type="date"
                  className={`form-control${errors.taskEndDate ? " is-invalid" : ""}`}
                  {...register("taskEndDate", {
                    required: "Task end date is required.",
                    validate: (taskEndDate) => {
                      const taskStartDate = getValues("taskStartDate");
                      if (
                        taskStartDate &&
                        new Date(taskEndDate) <= new Date(taskStartDate)
                      ) {
                        return "Task end date must be after task start date.";
                      }
                      if (
                        selectedMember &&
                        new Date(taskEndDate) >
                          new Date(selectedMember.projectEndDate)
                      ) {
                        return `Task end date cannot exceed the member's project end date (${selectedMember.projectEndDate}).`;
                      }
                    },
                  })}
                />
                {errors.taskEndDate && (
                  <p className="field-error">
                    <AlertCircle size={12} /> {errors.taskEndDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="form-submit-row">
            <button
              type="submit"
              className="btn-primary-custom"
              id="assignTaskBtn"
              disabled={!isDirty || !isValid}
            >
              Assign Task
            </button>
            <button
              type="button"
              className="btn-secondary-custom"
              onClick={() => resetForm()}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
