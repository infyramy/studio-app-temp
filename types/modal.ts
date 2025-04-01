export type ModalStatus = 'success' | 'error' | 'info';

export interface ModalState {
  isOpen: boolean;
  status: ModalStatus;
  title: string;
  message: string;
}

export interface StatusModalProps {
  isOpen: boolean;
  status: ModalStatus;
  title: string;
  message: string;
  buttonText?: string;
} 