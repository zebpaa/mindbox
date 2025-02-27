import '@testing-library/jest-dom';
import 'jest-localstorage-mock';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node', // или 'jsdom', в зависимости от вашего проекта
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
