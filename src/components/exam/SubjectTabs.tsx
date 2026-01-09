import { Subject } from '@/types/exam';

interface SubjectTabsProps {
  currentSubject: Subject;
  onSubjectChange: (subject: Subject) => void;
}

const subjects: { key: Subject; label: string }[] = [
  { key: 'mathematics', label: 'Mathematics' },
  { key: 'physics', label: 'Physics' },
  { key: 'chemistry', label: 'Chemistry' },
];

export const SubjectTabs = ({ currentSubject, onSubjectChange }: SubjectTabsProps) => {
  return (
    <div className="flex bg-panel-bg border-b border-panel-border">
      {subjects.map((subject) => (
        <button
          key={subject.key}
          onClick={() => onSubjectChange(subject.key)}
          className={`subject-tab ${
            currentSubject === subject.key 
              ? 'subject-tab-active' 
              : 'subject-tab-inactive'
          }`}
        >
          {subject.label}
        </button>
      ))}
    </div>
  );
};
