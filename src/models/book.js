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

    ISBN: DataTypes.STRING,
  };

  return sequelize.define('Book', schema);
};
