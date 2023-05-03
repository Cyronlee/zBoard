import { useEffect } from 'react';
import { Link, Text } from '@chakra-ui/react';
import { useToast as useChakraToast } from '@chakra-ui/toast';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const UpdateChecker = () => {
  const currentVersion = process.env.CURRENT_APP_VERSION || '0.0.0';
  const toast = useChakraToast();

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Cyronlee/zBoard/main/package.json')
      .then((res) => res.json())
      .then((data) => {
        const newVersion = data.version;
        if (currentVersion < newVersion) {
          toast({
            title: 'New version available',
            description: (
              <>
                <Text>
                  Current version is <b>{currentVersion}</b>
                </Text>
                <Text>
                  New version <b>{newVersion}</b> is available now
                </Text>
                <Text>
                  Check out new features on{' '}
                  <Link
                    textDecor="underline"
                    href="https://github.com/Cyronlee/zBoard/releases"
                    isExternal
                  >
                    Github <ExternalLinkIcon ml="2px" />
                  </Link>
                </Text>
              </>
            ),
            status: 'info',
            duration: 10000,
            isClosable: true,
            position: 'top-right',
          });
        }
      })
      .catch(() => console.warn('Fetch latest version failed.'));
  }, []);
  return <></>;
};

export default UpdateChecker;
