module.exports = (sequelize, DataTypes) => {
  const schema = {
    genre: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Genre is required.',
        },
        notEmpty: {
          args: [true],
          msg: 'Genre is required.',
        },
      },
    },
  };

  return sequelize.define('Genre', schema);
};
