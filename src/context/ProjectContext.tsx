import React, { createContext, useState, useContext, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  progress: number;
}

interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  tasks: Task[];
  documents: { name: string; icon: string }[];
  notes: string[];
}

interface ProjectContextType {
    projects: Project[];
    addProject: (project: Omit<Project, 'id'>) => void;
    updateProject: (id: string, project: Partial<Project>) => void;
    deleteProject: (id: string) => void;  // 新增删除项目的方法
    addTask: (projectId: string, task: Omit<Task, 'id'>) => void;
    updateTask: (projectId: string, taskId: string, task: Partial<Task>) => void;
    addDocument: (projectId: string, document: { name: string; icon: string }) => void;
    addNote: (projectId: string, note: string) => void;
  }
  
  const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: '1',
    name: '网站重设计',
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    progress: 65,
    tasks: [
      { id: '1', title: '设计用户界面', dueDate: '2023-08-31', progress: 80 },
      { id: '2', title: '前端开发', dueDate: '2023-10-31', progress: 0 },
      { id: '3', title: '后端开发', dueDate: '2023-11-30', progress: 50 },
    ],
    documents: [
      { name: '项目需求文档.pdf', icon: '📄' },
      { name: 'UI设计稿.sketch', icon: '📄' },
    ],
    notes: ['初始项目讨论完成', '需要安排第一次团队会议'],
  },
  // 可以添加更多初始项目
];

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>(() => {
      const storedProjects = localStorage.getItem('projects');
      return storedProjects ? JSON.parse(storedProjects) : initialProjects;
    });
  
    useEffect(() => {
      localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = { 
      ...project, 
      id: Date.now().toString(),
      tasks: [],
      documents: [],
      notes: []
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, ...updatedProject } : project
    ));
  };

  const addTask = (projectId: string, task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: Date.now().toString() };
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, tasks: [...project.tasks, newTask] } : project
    ));
  };

  const updateTask = (projectId: string, taskId: string, updatedTask: Partial<Task>) => {
    setProjects(projects.map(project => 
      project.id === projectId ? {
        ...project,
        tasks: project.tasks.map(task => 
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      } : project
    ));
  };

  const addDocument = (projectId: string, document: { name: string; icon: string }) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, documents: [...project.documents, document] } : project
    ));
  };

  const addNote = (projectId: string, note: string) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, notes: [...project.notes, note] } : project
    ));
  };
  const deleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      addProject, 
      updateProject, 
      deleteProject,  // 添加删除项目的方法
      addTask, 
      updateTask, 
      addDocument, 
      addNote 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};