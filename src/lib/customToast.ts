import { useToast as useChakraToast } from '@chakra-ui/toast';

export const useErrorToast = () => {
  const toast = useChakraToast();

  return (message: string) => {
    toast({
      title: 'Error occurred',
      duration: 6000,
      description: message,
      status: 'error',
      isClosable: true,
      position: 'bottom-right',
    });
  };
};

export const useInfoToast = () => {
  const toast = useChakraToast();

  return (title: string, message: string) => {
    toast({
      title: title,
      description: message,
      status: 'info',
      isClosable: true,
      position: 'top-right',
    });
  };
};
