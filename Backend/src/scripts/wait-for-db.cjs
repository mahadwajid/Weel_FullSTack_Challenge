const net = require("net");

function checkPort(host, port, timeout = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.once("error", () => {
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

async function waitForDb() {
  const maxAttempts = 30;
  const delay = 2000;
  
  console.log("Waiting for database to be ready...");
  
  for (let i = 0; i < maxAttempts; i++) {
    const isReady = await checkPort("db", 5432);
    
    if (isReady) {
      console.log("Database is ready!");
      return true;
    }
    
    if (i < maxAttempts - 1) {
      console.log(`Database not ready yet, waiting... (${i + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error("Database connection timeout after 60 seconds");
  return false;
}

waitForDb().then(success => {
  if (!success) {
    process.exit(1);
  }
});

