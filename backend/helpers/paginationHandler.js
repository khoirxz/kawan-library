// helper for pagination
/**
 *
 * @param {Object} model - The Sequelize model to paginate.
 * @param {Object} options - The options for pagination.
 * @param {Array} options.attributes - The attributes to select.
 * @param {Object} options.Op - The Sequelize operators.
 * @param {string} options.search - The search term.
 * @param {string} options.where - The field to search.
 * @param {number} options.page - The page number.
 * @param {number} options.limit - The number of items per page.
 * @returns {Promise<Object>} The paginated data and pagination info.
 */
const Paginate = async (
  model,
  { attributes, Op, search, where, page, limit, order, include = [] }
) => {
  const pageNumber = parseInt(page, 10); // Ensure radix is specified
  const pageSize = parseInt(limit, 10); // Ensure radix is specified

  const whereCondition = search
    ? { [where]: { [Op.like]: `%${search}%` } }
    : {};

  let data;
  if (attributes) {
    data = await model.findAndCountAll({
      attributes,
      where: whereCondition,
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      order,
      include: include,
    });
  } else {
    data = await model.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      order,
      include: include,
    });
  }

  return {
    data: data.rows,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      totalData: data.count,
      totalPage: Math.ceil(data.count / pageSize),
    },
  };
};

module.exports = { Paginate };
