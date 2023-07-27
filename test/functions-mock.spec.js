import { validateLinks,
getLinks } from '../src/functions';


test('should update status and ok properties for each link', async () => {
  // Crear dos objetos link con las propiedades esperadas
  const link1 = {
    href: 'https://github.com/roxanna-sa/MD-links/blob/main/src/blob.js',
    text: 'Ro',
    file: 'C:/Users/Roxana/Desktop/Laboratoria Proyects/MD-links/md-files/test2/testing-links.md',
  };

  const link2 = {
    href: 'https://www.google.com',
    text: 'Google',
    file: 'C:/Users/Roxana/Desktop/Laboratoria Proyects/MD-links/md-files/test2/testing-links.md',
  };

  const links = [link1, link2];

  // Mock de la función `validate` para simular las respuestas
  jest.mock('../src/functions.js', () => ({
    validate: jest.fn(link => {
      if (link.href === 'https://github.com/roxanna-sa/MD-links/blob/main/src/blob.js') {
        return Promise.resolve({
          status: 404,
          ok: 'fail',
        });
      } else {
        return Promise.resolve({
          status: 200,
          ok: 'ok',
        });
      }
    }),
  }));

  // Realizar la validación de los enlaces
  const result = await validateLinks(links);

  // Comprobar que los enlaces se hayan actualizado correctamente con los resultados de la validación
  expect(result).toEqual([
    {
      href: 'https://github.com/roxanna-sa/MD-links/blob/main/src/blob.js',
      text: 'Ro',
      file: 'C:/Users/Roxana/Desktop/Laboratoria Proyects/MD-links/md-files/test2/testing-links.md',
      status: 404,
      ok: 'fail',
    },
    {
      href: 'https://www.google.com',
      text: 'Google',
      file: 'C:/Users/Roxana/Desktop/Laboratoria Proyects/MD-links/md-files/test2/testing-links.md',
      status: 200,
      ok: 'ok',
    },
  ]);
});


jest.mock('fs', () => ({
  readFile: (filePath, encoding, callback) => {
    if (filePath === 'validFile.md') {
      // Simulamos datos de archivo válido para el caso de prueba
      callback(null, '[Link 1](https://example.com)\n[Link 2](https://example.org)');
    } else {
      // Simulamos un error para el caso de prueba donde el archivo no existe
      callback(new Error('File not found'));
    }
  },
}));

describe('getLinks', () => {
  it('should return an array of links when the file contains links', async () => {
    const filePath = 'validFile.md';
    const result = await getLinks(filePath);

    // Verificar el resultado esperado para el archivo válido
    expect(result).toEqual([
      {
        href: 'https://example.com',
        text: 'Link 1',
        file: filePath,
      },
      {
        href: 'https://example.org',
        text: 'Link 2',
        file: filePath,
      },
    ]);
  });

  it('should reject with an error when the file does not exist', async () => {
    const filePath = 'nonExistentFile.md';

    // Verificar que la función rechaza correctamente con un error cuando el archivo no existe
    await expect(getLinks(filePath)).rejects.toThrow('File not found');
  });
});


