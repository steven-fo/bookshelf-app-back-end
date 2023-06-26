const {nanoid} = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage,
    reading} = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    // eslint-disable-next-line max-len
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  books.push(newBook);
  response.code(201);
  return response;
};

const getAllBooksHandler = (request) => {
  const {name} = request.query;
  const {reading} = request.query;
  const {finished} = request.query;

  if (name) {
    // eslint-disable-next-line max-len
    const book = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    return {
      status: 'success',
      data: {
        books: book.map(({id, name, publisher}) => ({
          id, name, publisher,
        })),
      },
    };
  }

  if (reading === '1') {
    const book = books.filter((book) => book.reading === true);
    return {
      status: 'success',
      data: {
        books: book.map(({id, name, publisher}) => ({
          id, name, publisher,
        })),
      },
    };
  } else if (reading === '0') {
    const book = books.filter((book) => book.reading === false);
    return {
      status: 'success',
      data: {
        books: book.map(({id, name, publisher}) => ({
          id, name, publisher,
        })),
      },
    };
  }

  if (finished === '1') {
    const book = books.filter((book) => book.finished === true);
    return {
      status: 'success',
      data: {
        books: book.map(({id, name, publisher}) => ({
          id, name, publisher,
        })),
      },
    };
  } else if (finished === '0') {
    const book = books.filter((book) => book.finished === false);
    return {
      status: 'success',
      data: {
        books: book.map(({id, name, publisher}) => ({
          id, name, publisher,
        })),
      },
    };
  }

  return {
    status: 'success',
    data: {
      books: books.map(({id, name, publisher}) => ({
        id, name, publisher,
      })),
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  // eslint-disable-next-line max-len
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        // eslint-disable-next-line max-len
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    books[index] = {
      ...books[index],
      // eslint-disable-next-line max-len
      name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
