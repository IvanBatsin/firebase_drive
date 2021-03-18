import { IFile, IFolder, RootFolder } from "../interfaces";

export enum ActionTypes {
  SELECT_FOLDER = 'select_folder',
  UPDATE_FOLDER = 'update_folder',
  SET_CHILD_FOLDERS = 'SET_child_folders',
  SET_CHILD_FILES = 'SET_child_files'
}


// Action interfaces
export interface SelectFolder {
  type: ActionTypes.SELECT_FOLDER,
  payload: {folderId: string | null, folder: IFolder | null}
}
export interface UpdateFolder {
  type: ActionTypes.UPDATE_FOLDER,
  payload: IFolder
}
export interface SetChildFolders {
  type: ActionTypes.SET_CHILD_FOLDERS,
  payload: IFolder[]
}
export interface SetChildFiles {
  type: ActionTypes.SET_CHILD_FILES,
  payload: IFile[]
}


// Actions
export const selectFolder = (payload: {folderId: string | null, folder: IFolder | null}): SelectFolder => ({
  type: ActionTypes.SELECT_FOLDER,
  payload
});
export const updateFolder = (payload: IFolder): UpdateFolder => ({
  type: ActionTypes.UPDATE_FOLDER,
  payload
});
export const setChildFolders = (payload: IFolder[]): SetChildFolders => ({
  type: ActionTypes.SET_CHILD_FOLDERS,
  payload
});
export const setChildFiles = (payload: IFile[]): SetChildFiles => ({
  type: ActionTypes.SET_CHILD_FILES,
  payload
});

export type Actions = SelectFolder | UpdateFolder | SetChildFolders | SetChildFiles;