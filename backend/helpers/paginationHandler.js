// helper for pagination
const Paginate = async (model, options) => {
  const {
    page = 1,
    limit = 10,
    where = {},
    include = [],
    attributes = [],
    order = [["createdAt", "DESC"]],
  } = options;

  // Konversi page dan limit menjadi angka
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const offset = (pageNumber - 1) * pageSize;

  // Query ke database
  const { count, rows } = await model.findAndCountAll({
    where,
    include,
    attributes,
    limit: pageSize,
    offset,
    order,
  });

  // hitung metadata pagination
  const totalPages = Math.ceil(count / pageSize);

  return {
    data: rows,
    pagination: {
      totalItem: count,
      totalPages,
      currentPage: pageNumber,
      pageSize,
    },
  };
};

module.exports = { Paginate };
