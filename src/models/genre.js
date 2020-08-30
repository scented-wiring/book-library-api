module.exports = (sequelize, DataTypes) => {
  const schema = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Genre name is required.',
        },
        notEmpty: {
          args: [true],
          msg: 'Genre name is required.',
        },
      },
    },
  };

  return sequelize.define('Genre', schema);
};
