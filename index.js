const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const exercises = [
  {
    title: "Finding the Maximum in an Array",
    code: `function findMax(arr) {
    
      let max = arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] < max) {
          max = arr[i];
        }
      }
    
      return max;
    }`,
    solution: `function findMax(arr) {
    
      let max = arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
          max = arr[i];
        }
      }
    
      return max;
    }`,
  },
  {
    title: "Array Bubble Sort",
    code: `function bubbleSort(arr) {
      const n = arr.length;
    
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            arr[j] = arr[j + 1]
            arr[j + 1] = arr[j];
          }
        }
      }
    
      return arr;
    }`,
    solution: `function bubbleSort(arr) {
      const n = arr.length;
    
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            // Swap arr[j] and arr[j + 1]
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
      }
    
      return arr;
    }`,
  },
  {
    title: "Checking if a String is a Palindrome",
    code: `function palindrome(str) {

      var len = str.length;
      var mid = Math.floor(len/2);
  
      for ( var i = 0; i < mid; i++ ) {
          if (str[i] !== str[len - 1 - i]) {
              return true;
          }
      }
  
      return false;
  }`,
    solution: `function palindrome(str) {

    var len = str.length;
    var mid = Math.floor(len/2);

    for ( var i = 0; i < mid; i++ ) {
        if (str[i] !== str[len - 1 - i]) {
            return false;
        }
    }

    return true;
}`,
  },
  {
    title: "Creating a Star Pyramid",
    code: `function createStarPyramid(size) {
      for (let i = 1; i < size; i++) {
        const spaces = ' '.repeat(size);
        const stars = '*'.repeat(i);
        console.log(spaces + stars);
      }
    }`,
    solution: `function createStarPyramid(size) {
      for (let i = 1; i <= size; i++) {
        const spaces = ' '.repeat(size - i);
        const stars = '*'.repeat(2 * i - 1);
        console.log(spaces + stars);
      }
    }`,
  },
];

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/exercises", (req, res) => {
  res.json(exercises);
});

const codePages = [
  { codeId: "1", clientsIn: [] },
  { codeId: "2", clientsIn: [] },
  { codeId: "3", clientsIn: [] },
  { codeId: "4", clientsIn: [] },
];

function deleteDuplicate(index) {
  codePages[index].clientsIn = [...new Set(codePages[index].clientsIn)];
}

function deleteClient(index, socketID) {
  const clientIndex = codePages[index].clientsIn.indexOf(socketID);
  codePages[index].clientsIn.splice(clientIndex, 1);
}

io.on("connection", (socket) => {
  socket.on("code_entered", (id) => {
    socket.join(id);
    const index = parseInt(id) - 1;
    const isFirstEnter = codePages[index].clientsIn.length === 0;
    codePages[index].clientsIn.push(socket.id);
    deleteDuplicate(index);

    socket.emit("is_first", isFirstEnter);
  });

  socket.on("update_code", (data) => {
    socket.to(data.id).emit("updated_code", data.newCode);
  });

  socket.on("code_exit", (id) => {
    const index = parseInt(id) - 1;
    deleteClient(index, socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server is running");
});
