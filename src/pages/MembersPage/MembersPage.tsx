import { Users } from "lucide-react";
import "./MembersPage.css";
import { useEffect, useState } from "react";
import type { MemberData } from "../../types";

export default function MembersPage() {
  const [members, setMembers] = useState<MemberData[]>([]);

  const fetchMembers = async () => {
    const response = await fetch("http://localhost:3001/members");
    const data = await response.json();
    console.log("Members Data", data);
    setMembers(data);
  };
  useEffect(() => {
    fetchMembers();
  }, []);
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__icon-wrap icon-bg-purple">
          <Users size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="page-header__title">Team Members</h2>
          <p className="page-header__subtitle">
            Fetch all members sorted by experience — coming soon.
          </p>
        </div>
      </div>
      <div className="page-content">
        <div>
          {members.map((member) => (
            <div key={member.id} className="member-card">
              <div>Name: {member.memberName}</div>
              <div>ID: {member.memberId}</div>
              <div>Experience: {member.memberExperience}</div>
              <div>
                Skillset:{" "}
                {member.memberSkillset?.map((skill) => (
                  <span className="member-skillset-pill">{skill}</span>
                ))}
              </div>
              <div>Description: {member.memberDescription}</div>
              <div>Project Start Date: {member.projectStartDate}</div>
              <div>Project End Date: {member.projectEndDate}</div>
              <div>
                Allocation Percentage: {member.memberAllocationPercentage}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
