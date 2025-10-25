// src/components/TaskList.tsx
import React from 'react';

interface TaskListProps {
  children: React.ReactNode;
}

const TaskList: React.FC<TaskListProps> = ({ children }) => {
  return (
    <ul className="contains-task-list">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === 'li' && child.props.className?.includes('task-list-item')) {
          const checkbox = child.props.children?.find((c: any) => 
            React.isValidElement(c) && c.type === 'input' && c.props.type === 'checkbox'
          );
          
          if (checkbox) {
            const taskText = child.props.children
              .filter((c: any) => !React.isValidElement(c) || (c.type !== 'input'))
              .join('')
              .trim();
            
            return React.cloneElement(child, {
              children: [
                React.cloneElement(checkbox, {
                  'aria-label': `Task: ${taskText}`,
                  'aria-describedby': `task-${index}-description`
                }),
                <span key="description" id={`task-${index}-description`} className="sr-only">
                  {taskText}
                </span>,
                ...child.props.children.filter((c: any) => !React.isValidElement(c) || (c.type !== 'input'))
              ]
            });
          }
        }
        return child;
      })}
    </ul>
  );
};

export default TaskList;
