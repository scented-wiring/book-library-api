module.exports = (sequelize, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Title is required.',
        },
      },
    },

    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Author is required.',
        },
      },
    },

    genre: DataTypes.STRING,
    ISBN: DataTypes.STRING,
  };

  return sequelize.define('Book', schema);
};
