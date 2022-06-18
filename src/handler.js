const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    // Client mengirim data catatan (title, tags, dan body) yang akan disimpan dalam bentuk JSON melalui body request.
    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updateAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updateAt,
    };

    // Kita sudah memiliki properti dari objek catatan secara lengkap. Sekarang, saatnya kita masukan nilai-nilai tersebut ke dalam array notes menggunakan method push().
    notes.push(newNote);

    // manfaatkan method filter() berdasarkan id catatan untuk mengetahui apakah newNote sudah masuk ke dalam array notes atau belum
    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id, 
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    // Di dalam fungsi ini kita harus mengembalikan objek catatan secara spesifik berdasarkan id yang digunakan oleh path parameter.
    const { id } = request.params;

    // Setelah mendapatkan nilai id, dapatkan objek note dengan id tersebut dari objek array notes. Manfaatkan method array filter() untuk mendapatkan objeknya.
    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            }
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) => {
    // Catatan yang diubah akan diterapkan sesuai dengan id yang digunakan pada route parameter. Jadi, kita perlu mendapatkan nilai id-nya terlebih dahulu.
    const { id } = request.params;

    // Setelah itu, kita dapatkan data notes terbaru yang dikirimkan oleh client melalui body request.
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    // Pertama, dapatkan dulu index array pada objek catatan sesuai id yang ditentukan. Untuk melakukannya, gunakanlah method array findIndex().
    const index = notes.findIndex((note) => note.id === id);

    // Bila note dengan id yang dicari ditemukan, index akan bernilai array index dari objek catatan yang dicari. Namun, bila tidak ditemukan, index akan bernilai -1. Jadi, kita bisa menentukan gagal atau tidaknya permintaan dari nilai index menggunakan if else.
    if (index !== 1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui catatan. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }

const deleteNoteByIdHandler = (request, h) => {
    // Dapatkan dulu nilai id yang dikirim melalui path parameter
    const { id } = request.params;

    // Selanjutnya, dapatkan index dari objek catatan sesuai dengan id yang didapat.
    const index = notes.findIndex((note) => note.id === id);

    // Lakukan pengecekan terhadap nilai index, pastikan nilainya tidak -1 bila hendak menghapus catatan. Nah, untuk menghapus data pada array berdasarkan index, gunakan method array splice().
    if(index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
        }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


module.exports = { 
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteByIdHandler, 
    editNoteByIdHandler, 
    deleteNoteByIdHandler 
};