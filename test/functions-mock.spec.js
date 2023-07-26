import { validateLinks } from '../src/functions';

test('should update status and ok properties for each link', async () => {
  // Creamos dos objetos link con las propiedades esperadas
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

  // Realizamos la validación de los enlaces
  const result = await validateLinks(links);

  // Comprobamos que los enlaces se hayan actualizado correctamente con los resultados de la validación
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
