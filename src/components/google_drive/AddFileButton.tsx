import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { database, storage } from '../../firebase';
import { IFile, IFolder, RootFolder } from '../../interfaces';
import { v4 } from 'uuid';
import ReactDOM from 'react-dom';
import { ProgressBar, Toast } from 'react-bootstrap';

interface AddFileButtonProps {
  currentFolder: IFolder | null
}

interface FileProgress {
  name: string,
  id: string,
  progress: number,
  error: boolean
}

export const AddFileButton: React.FC<AddFileButtonProps> = ({currentFolder}: AddFileButtonProps) => {
  const { currentUser } = useAuth();
  const [uploadingFiles, setUploadingFiles] = React.useState<FileProgress[]>([]);

  const handleFileChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const file = event.currentTarget.files![0];

    if (!file || !currentFolder) return;

    const id = v4();
    setUploadingFiles(prevState => [
      ...prevState,
      {id, name: file.name, progress: 0, error: false}
    ]);

    const parentPath = currentFolder.path.length > 0 ? `${currentFolder.path.join('/')}/${currentFolder.name}/${file.name}` : `/${file.name}`;
    const filePath = currentFolder.name === RootFolder.name ? parentPath : `${currentFolder.name}/${parentPath}/${file.name}`;

    // Upload file to firebase
    const uploadTask = storage.ref(`/files/${currentUser?.uid}/${filePath}`).put(file);

    // 3 options
    // snapshop - show progress
    // error handler
    // function after upload image to server
    uploadTask.on('state_changed', snapshot => {
      const progress = snapshot.bytesTransferred / snapshot.totalBytes;
      setUploadingFiles(prevState => {
        return prevState.map(uploadFile => {
          if (uploadFile.id === id) {
            return {...uploadFile, progress};
          }
          return uploadFile;
        });
      })
    }, () => {
      setUploadingFiles(prevState => {
        return prevState.map(uploadFile => {
          if (uploadFile.id === id) {
            return {...uploadFile, error: true};
          }
          return uploadFile;
        });
      })
    }, () => {
      setUploadingFiles(prevState => {
        return prevState.filter(uploadFile => uploadFile.id !== id);
      });
      
      uploadTask.snapshot.ref.getDownloadURL().then(url => {
        // Check for existing fotos
        database.files
          .where('name', '==', file.name)
          .where('userId', '==', currentUser?.uid)
          .where('folderId', '==', currentFolder.id)
          .get()
          .then(existingFiles => {
            const existingFile = existingFiles.docs[0];
            if (existingFile) {
              existingFile.ref.update({url});
            } else {
              // Creat new file
              database.files.add({
                createdAt: database.getCurrentTimeStamp(),
                folderId: currentFolder.id!,
                userId: currentUser?.uid!,
                name: file.name,
                url
              });
            }
          });

      });
    });
  }

  if (!currentFolder) return null;

  return (
    <>
      <label className="btn btn-outline-success btn-sm m-0 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-text" viewBox="0 0 16 16">
          <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
          <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
        </svg>
        <input type="file" onChange={handleFileChange} style={{opacity: 0, position: 'absolute', left: -33333}}/>
      </label>
      {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div style={{position: 'absolute', bottom: '1rem', left: '1rem', maxWidth: 250}}>
            {uploadingFiles.map(file => {
              return (
                <Toast key={file.id} onClose={() => {
                  setUploadingFiles(prevState => {
                    return prevState.filter(uploadFile => !uploadFile.error);
                  })
                }}>
                  <Toast.Header closeButton={file.error} className="text-truncate w-100 d-block">
                    {file.name}
                  </Toast.Header>
                  <Toast.Body>
                    <ProgressBar
                      variant={file.error ? 'danger' : 'success'}
                      animated={!file.error}
                      now={file.error ? 100 : file.progress * 100}
                      label={
                        file.error ? 'Error' : `${Math.round(file.progress * 100)}%`
                      }/>
                  </Toast.Body>
                </Toast>
              )
            })}
          </div>,
          document.body
        )
      }
    </>
  )
}