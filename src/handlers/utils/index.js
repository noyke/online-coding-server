const { codePages } = require("../data");

const deleteDuplicate = (index) => {
  codePages[index].clientsIn = [...new Set(codePages[index].clientsIn)];
};

const deleteClient = (socketID) => {
  codePages.map((codePage) => {
    const clientIndex = codePage.clientsIn.indexOf(socketID);
    if (clientIndex !== -1) {
      codePage.clientsIn.splice(clientIndex, 1);
    }
  });
};

module.exports = { deleteDuplicate, deleteClient };
