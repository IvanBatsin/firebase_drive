import React from 'react';
import { useAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { IFile, IFolder, RootFolder } from '../interfaces';
import { Actions, ActionTypes, selectFolder, setChildFiles, setChildFolders, updateFolder } from './actions';


export interface State {
  folderId: string | null,
  folder: IFolder | null,
  childerFolders: IFolder[],
  childrenFiles: string[],
  childFiles: IFile[]
}

const initialState: State = {
  childerFolders: [],
  childrenFiles: [], 
  folder: RootFolder, 
  folderId: null,
  childFiles: []
};

const reducer: React.Reducer<State, Actions> = (state = initialState, action): State => {
  // console.log('action type - ', action.type);
  // console.log('action payload - ', action.payload);
  switch(action.type) {
    case ActionTypes.SELECT_FOLDER: {
      return {
        childrenFiles: [],
        childerFolders: [],
        childFiles: [],
        folder: action.payload.folder,
        folderId: action.payload.folderId
      }
    }

    case ActionTypes.UPDATE_FOLDER: {
      return {
        ...state,
        folder: action.payload,
      }
    }

    case ActionTypes.SET_CHILD_FOLDERS: {
      return {
        ...state,
        childerFolders: action.payload,
      }
    }

    case ActionTypes.SET_CHILD_FILES: {
      return {
        ...state,
        childFiles: action.payload,
      }
    }
    default: return state;
  }
}

export const useFolder = (folderId: string | null = null, folder: IFolder | null = null): State => {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Actions>>(reducer, {
    folderId,
    folder,
    childerFolders: [],
    childrenFiles: [],
    childFiles: []
  });
  const { currentUser } = useAuth();

  React.useEffect(() => {
    dispatch(selectFolder({folderId, folder}))
  }, [folder, folderId]);

  React.useEffect(() => {
    if (folderId === null) {
      dispatch(updateFolder(RootFolder));
    } else {
      database.folders.doc(folderId).get()
        .then(doc => {
          const formattedDoc = database.formattedDoc(doc);
          dispatch(updateFolder(formattedDoc as IFolder));
        })
        .catch(err => {
          console.log('error', err);
          dispatch(updateFolder(RootFolder));
        });
    }

  }, [folderId]);

  React.useEffect(() => {
    return database.folders
      .where('parentId', '==', state.folderId)
      .where('userId', '==', currentUser?.uid)
      .orderBy('createdAt')
      .onSnapshot(snapShot => {
        const payload = snapShot.docs.map(doc => {
          return database.formattedDoc(doc) as IFolder;
        });
        dispatch(setChildFolders(payload));
      });
  }, [folderId, currentUser]);

  React.useEffect(() => {
    return database.files
      .where('folderId', '==', state.folderId)
      .where('userId', '==', currentUser?.uid)
      // .orderBy('createdAt')
      .onSnapshot(snapShot => {
        const payload = snapShot.docs.map(doc => {
          return database.formattedDoc(doc) as IFile;
        });
        dispatch(setChildFiles(payload));
      });
  }, [folderId, currentUser]);

  return state;
}