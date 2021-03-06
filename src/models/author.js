module.exports = (sequelize, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Author is required.',
        },
        notEmpty: {
          args: [true],
          msg: 'Author is required.',
        },
      },
    },
  };

  return sequelize.define('Author', schema);
};
