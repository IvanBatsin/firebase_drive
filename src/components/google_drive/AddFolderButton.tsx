import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../firebase';
import { IFolder, RootFolder } from '../../interfaces';

interface AddFolderButtonProps {
  currentFolder: IFolder | null
}

export const AddFolderButton: React.FC<AddFolderButtonProps> = ({currentFolder}: AddFolderButtonProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');
  const { currentUser } = useAuth();

  const openModal = (): void => {
    setOpen(true);
  }

  const closeModal = (): void => {
    setOpen(false);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      if (!currentFolder) {
        return;
      }

      const path = [...currentFolder?.path!];

      if (currentFolder!.name !== RootFolder!.name) {
        path.push({id: currentFolder?.id!, name: currentFolder!.name!});
      }

      // Create new folder in database
      await database.folders.add({
        name,
        parentId: currentFolder?.id,
        userId: currentUser?.uid,
        path,
        createdAt: database.getCurrentTimeStamp()
      });

      setName('');
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Button onClick={openModal} variant="outline-success" size="sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-folder-plus" viewBox="0 0 16 16">
          <path d="M.5 3l.04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2zm5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19c-.24 0-.47.042-.684.12L1.5 2.98a1 1 0 0 1 1-.98h3.672z"/>
          <path d="M13.5 10a.5.5 0 0 1 .5.5V12h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V13h-1.5a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z"/>
        </svg>
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" required value={name} onChange={event => setName(event.target.value)}/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Close</Button>
            <Button variant="success" type="submit">Add folder</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}