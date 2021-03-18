import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IFolder, RootFolder } from '../../interfaces';

interface FolderBreadCrumpsProps {
  currentFolder: IFolder
}

export const FolderBreadCrumbs: React.FC<FolderBreadCrumpsProps> = ({currentFolder}: FolderBreadCrumpsProps) => {
  if (!currentFolder) return null;

  let path = currentFolder.name === RootFolder.name ? [] : [{name: RootFolder.name, id: RootFolder.id}];

  if (currentFolder) {
    path = [...path, ...currentFolder.path];
  }
  
  return (
    <Breadcrumb className="flex-grow-1" listProps={{className: "bg-white pl-0 m-0"}}>
      {path.map((folder, index) => {
        return (
          <Breadcrumb.Item 
            key={folder.id} 
            linkAs={Link} 
            linkProps={{
              to: {
                pathname: folder.id ? `/folder/${folder.id}` : '/', 
                state: {
                  folder: {...folder, path: path.slice(1, index)}
                }}}} 
            className="text-truncate d-inline-block" 
            style={{maxWidth: 150}}>
            {folder.name}
          </Breadcrumb.Item>
        )
      })}
      {currentFolder && (
        <Breadcrumb.Item className="text-truncate d-inline-block" style={{maxWidth: 200}} active>
          {currentFolder.name}
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  )
}