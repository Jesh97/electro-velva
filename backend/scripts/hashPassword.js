// Script para hashear contraseñas
// Uso: node scripts/hashPassword.js "mi_contraseña"

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Uso: node scripts/hashPassword.js "tu_contraseña"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\n✅ Contraseña hasheada:');
console.log(hash);
console.log('\n📋 Copia este hash para insertarlo en la base de datos\n');

