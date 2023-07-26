import axios from 'axios';
import { getLinksInFile,
validate } from '../src/functions.js';

// Mock de la función getLinks
jest.mock('../src/functions', () => ({
  getLinksInFile: jest.fn(),
}));

describe('getLinksInFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the links from getLinksInFile', async () => {
    // Definir el mock de la función getLinksInFile para que devuelva una lista de enlaces
    const mockLinks = [
      { href: 'https://example.com', text: 'Example Link 1', file: '/root/file1.md' },
      { href: 'https://example.org', text: 'Example Link 2', file: '/root/file1.md' },
    ];
    // Configurar el mock correctamente para resolver la promesa con el valor deseado
    getLinksInFile.mockResolvedValue(mockLinks);

    // Act
    const result = await getLinksInFile('/root/file1.md');

    // Assert
    expect(result).toEqual(mockLinks);
    // Verificar que se haya llamado a la función getLinksInFile con el argumento correcto
    expect(getLinksInFile).toHaveBeenCalledWith('/root/file1.md');
  });

});

