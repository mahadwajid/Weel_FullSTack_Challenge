'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const [existingUsers] = await queryInterface.sequelize.query(
      "SELECT id FROM \"Users\" WHERE email = 'user@example.com'"
    );
    
    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await queryInterface.bulkInsert('Users', [
        {
          email: 'user@example.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      console.log('User seeded successfully');
    } else {
      console.log('User already exists, skipping seed');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: 'user@example.com'
    });
  }
};

