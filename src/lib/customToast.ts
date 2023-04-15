import { useToast as useChakraToast, ToastProps } from '@chakra-ui/toast';

export const useErrorToast = () => {
  const toast = useChakraToast();

  return (message) => {
    toast({
      title: 'Error occurred',
      duration: 6000,
      description: message,
      status: 'error',
      isClosable: true,
      position: 'top-right',
    });
  };
};
