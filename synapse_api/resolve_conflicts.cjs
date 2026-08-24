const fs = require('fs');

const resolveConflict = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the conflict markers and keep both sections
  content = content.replace(/<<<<<<< HEAD\r?\n/g, '');
  content = content.replace(/=======\r?\n/g, '\n');
  content = content.replace(/>>>>>>> .*\r?\n/g, '');
  
  fs.writeFileSync(filePath, content);
};

resolveConflict('src/modules/programas/programs.controller.ts');
resolveConflict('src/modules/programas/programs.routes.ts');
