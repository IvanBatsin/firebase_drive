import React from 'react';
import { Container } from 'react-bootstrap';
import { State, useFolder } from '../../hooks/useFolder';
import { AddFolderButton } from './AddFolderButton';
import { Folder } from './Folder';
import { NavbarComponent } from './Navbar';
import { useLocation, useParams } from 'react-router-dom';
import { FolderBreadCrumbs } from './FolderBreadCrumbs';
import { AddFileButton } from './AddFileButton';
import { File } from './File';

export const Dashboard: React.FC = () => {
  const { folderId } = useParams<{folderId: string}>();
  const state = useFolder(folderId);

  return (
    <>
      <NavbarComponent/>
      <Container fluid>
        <div className="d-flex align-items-center">
          <FolderBreadCrumbs currentFolder={state.folder!}/>
          <AddFileButton currentFolder={state.folder}/>
          <AddFolderButton currentFolder={state.folder}/>
        </div>
        {state.childerFolders.length > 0 &&
          <div className="d-flex flex-wrap">
            {state.childerFolders.map(folder => {
              return (
                <div key={folder.id} style={{maxWidth: 250}} className="p-2">
                  <Folder folder={folder}/>
                </div>
              )
            })}
          </div>
        }
        {state.childerFolders.length > 0 && state.childFiles.length > 0 && <hr/>}
        {state.childFiles.length > 0 &&
          <div className="d-flex flex-wrap">
            {state.childFiles.map(file => {
              return (
                <div key={file.id} style={{maxWidth: 250}} className="p-2">
                  <File file={file}/>
                </div>
              )
            })}
          </div>
        }
      </Container>
    </>
  )
}