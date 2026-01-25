import { Subject } from "@/types/exam";
import { allQuestions } from "@/data/questions";

interface SubjectTabsProps {
  currentSubject: Subject;
  onSubjectChange: (subject: Subject) => void;
}

export const SubjectTabs = ({
  currentSubject,
  onSubjectChange,
}: SubjectTabsProps) => {
  const subjects = Object.keys(allQuestions) as Subject[];

  return (
    <div className="flex bg-panel-bg border-b border-panel-border overflow-x-auto">
      {subjects.map((subject) => (
        <button
          key={subject}
          onClick={() => onSubjectChange(subject)}
          className={`subject-tab ${
            currentSubject === subject
              ? "subject-tab-active"
              : "subject-tab-inactive"
          }`}
        >
          {subject === "aptitude"
            ? "General Aptitude"
            : "Web Fundamentals"}
        </button>
      ))}
    </div>
  );
};
