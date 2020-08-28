module.exports = (sequelize, DataTypes) => {
  const schema = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: [true],
          msg: 'Email address must be valid.',
        },
        notNull: {
          args: [true],
          msg: 'Email address is required.',
        },
      },
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Name is required.',
        },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Password is required.',
        },
        lengthTest(value) {
          if (value.length < 8)
            throw new Error('Password must be a minimum of 8 characters.');
        },
      },
    },
  };

  return sequelize.define('Reader', schema);
};
