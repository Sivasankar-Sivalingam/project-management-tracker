import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import type { MemberData } from "../../types";
import "./MemberSearch.css";

interface MemberSearchProps {
  id?: string;
  members: MemberData[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (member: MemberData) => void;
  placeholder?: string;
  isInvalid?: boolean;
}

export default function MemberSearch({
  id,
  members,
  value,
  onChange,
  onSelect,
  placeholder = "Search by member name or ID…",
  isInvalid = false,
}: MemberSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMembers = value.trim()
    ? members.filter(
        (member) =>
          member.memberName.toLowerCase().includes(value.toLowerCase()) ||
          member.memberId.toLowerCase().includes(value.toLowerCase()),
      )
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleFocus = () => {
    if (value.trim()) setShowSuggestions(true);
  };

  const handleSelectMember = (member: MemberData) => {
    setShowSuggestions(false);
    onSelect(member);
  };

  return (
    <div className="search-wrap" ref={searchWrapRef}>
      <div className={`search-input-row ${isInvalid ? "is-invalid" : ""}`}>
        <Search size={15} className="search-icon" />
        <input
          id={id}
          className="search-input"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          autoComplete="off"
        />
      </div>

      {showSuggestions && filteredMembers.length > 0 && (
        <ul className="suggestions-list" role="listbox">
          {filteredMembers.map((member) => (
            <li
              key={member.memberId}
              className="suggestion-item"
              role="option"
              onMouseDown={() => handleSelectMember(member)}
            >
              <span className="suggestion-name">{member.memberName}</span>
              <span className="suggestion-id">{member.memberId}</span>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && value.trim() && filteredMembers.length === 0 && (
        <div className="suggestions-empty">No members match your search.</div>
      )}
    </div>
  );
}
