import { Subject } from "@/types/exam";

interface SubjectTabsProps {
  currentSubject: Subject;
  onSubjectChange: (subject: Subject) => void;
}

const subjects: { key: Subject; label: string }[] = [
  { key: "aptitude", label: "Aptitude" },
  { key: "programming", label: "Programming" },
  { key: "web", label: "Web Basics" },
  { key: "mindset", label: "Mindset" },
];

export const SubjectTabs = ({
  currentSubject,
  onSubjectChange,
}: SubjectTabsProps) => {
  return (
    <div className="flex bg-panel-bg border-b border-panel-border overflow-x-auto">
      {subjects.map((subject) => (
        <button
          key={subject.key}
          onClick={() => onSubjectChange(subject.key)}
          className={`subject-tab ${
            currentSubject === subject.key
              ? "subject-tab-active"
              : "subject-tab-inactive"
          }`}
        >
          {subject.label}
        </button>
      ))}
    </div>
  );
};
