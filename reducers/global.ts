import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { SnapshotEventPayload } from '../actions/firestore';
import { sessionActionCreators } from '../actions/session';
import {
  projectCollectionActionCreator,
  taskCollectionActionCreator,
  todoActionCreators
} from '../actions/todo';
import { Project, Task } from '../domain/todo';
import { User } from '../domain/user';
import {
  removeDocuments,
  replaceDocument,
  updateDocuments
} from '../services/firestore';

export const globalState = {
  editTaskId: null as string | null,
  isReadyFirebase: false,
  projects: null as Project[] | null,
  tasks: null as Tasks | null,
  user: null as User | null
};
export type GlobalState = typeof globalState;

interface Tasks {
  [key: string]: Task[];
}

const replaceProjects = (
  orgState: GlobalState,
  payload: SnapshotEventPayload<Project>
): GlobalState => {
  const state = { ...orgState };
  if (!state.projects) {
    return state;
  }
  state.projects = payload.docs.reduce(replaceDocument, state.projects);
  return state;
};

const replaceTasks = (
  state: GlobalState,
  payload: SnapshotEventPayload<Task>
): GlobalState => {
  const prevTasks: Tasks = state.tasks ? { ...state.tasks } : {};
  const tasks = payload.docs;
  const newTasks = tasks.reduce((acc, task) => {
    const projectTasks = acc[task.projectId] ? acc[task.projectId] : [];
    const index = projectTasks.findIndex(t => t.id === task.id);
    if (index === -1) {
      acc[task.projectId] = [...projectTasks, task];
      return acc;
    }
    projectTasks.splice(index, 1, task);
    acc[task.projectId] = projectTasks;
    return acc;
  }, prevTasks);
  return { ...state, tasks: newTasks };
};

const removeTasks = (
  state: GlobalState,
  payload: SnapshotEventPayload<Task>
): GlobalState => {
  const prevTasks: Tasks = state.tasks ? { ...state.tasks } : {};
  const tasks = payload.docs;
  const newTasks = tasks.reduce((acc, task) => {
    const projectTasks = acc[task.projectId] ? acc[task.projectId] : [];
    const index = projectTasks.findIndex(t => t.id === task.id);
    if (index === -1) {
      return acc;
    }
    projectTasks.splice(index, 1);
    acc[task.projectId] = projectTasks;
    return acc;
  }, prevTasks);
  return { ...state, tasks: newTasks };
};

export const globalReducer = reducerWithInitialState(globalState)
  .case(todoActionCreators.clickEditTaskButton, (state, task) => {
    return { ...state, editTaskId: task.id };
  })
  .case(todoActionCreators.clickUpdateTaskButton, state => {
    return { ...state, editTaskId: null };
  })
  .case(todoActionCreators.clickCloseTaskButton, state => {
    return { ...state, editTaskId: null };
  })
  .case(taskCollectionActionCreator.added, replaceTasks)
  .case(projectCollectionActionCreator.added, (state, payload) => {
    const beforeProjects = state.projects ? state.projects : [];
    return {
      ...state,
      projects: updateDocuments(beforeProjects, payload.docs)
    };
  })
  .case(taskCollectionActionCreator.modified, replaceTasks)
  .case(taskCollectionActionCreator.removed, removeTasks)
  .case(projectCollectionActionCreator.modified, replaceProjects)
  .case(projectCollectionActionCreator.removed, (state, payload) => {
    if (state.projects === null) {
      return { ...state };
    }
    const projects = removeDocuments(state.projects, payload.docs);
    return { ...state, projects };
  })
  .case(sessionActionCreators.finishFirebaseInitializing, state => {
    return { ...state, isReadyFirebase: true };
  })
  .case(sessionActionCreators.updateUser, (state, payload) => {
    return { ...state, user: payload.user };
  });
