import * as React from 'react';
import {
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { VscPerson, VscKey, VscArrowRight } from 'react-icons/vsc';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from 'react-query';
import { HTTPError, LoginPayload, useApiClient } from '../api';
import { useUser } from '../context';

const schema = yup
  .object({
    username: yup.string().required().min(3).max(128),
    password: yup.string().required().min(3).max(128),
  })
  .required();

export function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginPayload['data']>({
    resolver: yupResolver(schema),
  });
  const apiClient = useApiClient();
  const user = useUser();
  const [loginError, setLoginError] = React.useState('');

  const login = useMutation(apiClient.postForToken, {
    onSuccess: (response) => {
      const { token } = response.data;
      user.setToken(token);
    },
    onError: (error: HTTPError) => {
      if (error.response.status >= 500) {
        setLoginError('Cannot login at this point in time. Try again later.');
      } else if (error.response.status >= 400) {
        setLoginError('Provided credentials are incorrect.');
      } else {
        setLoginError('Unknown error while logging in. Try again later.');
      }
    },
  });

  const onSubmit = React.useCallback(async (data: LoginPayload['data']) => {
    login.mutate({ data });
  }, []);

  const onFormFieldChange = React.useCallback(() => {
    setLoginError('');
  }, []);

  return (
    <Flex width="full" justify="center" pt="16">
      <Flex py="4" px="8" direction="column">
        <Heading as="h1" size="md" mb="4">
          Login
        </Heading>
        {loginError ? <Text color="red.600">{loginError}</Text> : null}
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack align="flex-start">
            <Flex direction="column">
              <InputGroup size="md">
                <InputLeftElement
                  pointerEvents="none"
                  children={<VscPerson color="gray.300" />}
                />
                <Input
                  pr="4rem"
                  type="text"
                  placeholder="Enter username"
                  autoComplete="username"
                  backgroundColor="white"
                  isInvalid={Boolean(errors.username)}
                  errorBorderColor="red.600"
                  {...register('username', { onChange: onFormFieldChange })}
                />
              </InputGroup>
              {errors.username ? (
                <Text textAlign="left" fontSize="sm" color="red.600">
                  {errors.username.message}
                </Text>
              ) : null}
            </Flex>
            <Flex direction="column">
              <InputGroup size="md">
                <InputLeftElement
                  pointerEvents="none"
                  children={<VscKey color="gray.300" />}
                />
                <Input
                  pr="4rem"
                  type="password"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  backgroundColor="white"
                  isInvalid={Boolean(errors.password)}
                  errorBorderColor="red.600"
                  {...register('password', { onChange: onFormFieldChange })}
                />
              </InputGroup>
              {errors.password ? (
                <Text textAlign="left" fontSize="sm" color="red.600">
                  {errors.password.message}
                </Text>
              ) : null}
            </Flex>
            <Button
              colorScheme="teal"
              size="md"
              rightIcon={<VscArrowRight />}
              type="submit"
              alignSelf="flex-end"
              isLoading={login.isLoading}
            >
              Log in
            </Button>
          </VStack>
        </form>
      </Flex>
    </Flex>
  );
}
