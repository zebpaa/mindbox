export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+.(ts|tsx)$': 'ts-jest', // Используйте ts-jest для обработки TypeScript
  },
  moduleNameMapper: {
    '.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Убедитесь, что файл имеет правильное расширение
};
