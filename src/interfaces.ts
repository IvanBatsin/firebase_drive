export interface IPath {
  name: string,
  id: string
}

export interface IFolder {
  id: string | null,
  name: string,
  path: IPath[],
  parentId: string | null,
  createdAt?: string
}

export const RootFolder: IFolder = {
  name: 'ROOT',
  id: null,
  path: [],
  parentId: null
}

export interface IFile {
  id: string | null
  url: string,
  name: string,
  folderId: string,
  createdAt: any,
  userId: string
}