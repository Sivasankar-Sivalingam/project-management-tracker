import React, { useState, useRef } from "react";
import type { SkillTagInputProps } from "../../types";
import "./SkillTagInput.css";

export default function SkillTagInput({
  skills,
  onChange,
  isInvalid,
}: SkillTagInputProps) {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addSkill = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInputVal("");
  };

  const removeSkill = (skill: string) =>
    onChange(skills.filter((s) => s !== skill));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputVal);
    }
    if (e.key === "Backspace" && inputVal === "" && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div
      className={`skills-input-wrapper${isInvalid ? " is-invalid" : ""}`}
      onClick={() => inputRef.current?.focus()}
    >
      {skills.map((skill) => (
        <span key={skill} className="skill-tag">
          {skill}
          <button
            type="button"
            className="skill-tag__remove"
            onClick={(e) => {
              e.stopPropagation();
              removeSkill(skill);
            }}
            aria-label={`Remove ${skill}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id="memberSkillset"
        className="skills-text-input"
        placeholder={skills.length === 0 ? "Type a skill and press Enter…" : ""}
        aria-label="Add skill"
        value={inputVal}
        onKeyDown={handleKeyDown}
        onChange={(e) => setInputVal(e.target.value)}
        onBlur={() => {
          if (inputVal.trim()) addSkill(inputVal);
        }}
      />
    </div>
  );
}
