const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {
  // TODO: how do we prove to the server we're on the nice list? 

  // create the merkle tree for the whole nice list
  const merkleTree = new MerkleTree(niceList);

  // Uncomment to generate and see the merkel root
  const root = merkleTree.getRoot();
  console.log('root:', root);
  console.log();

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * niceList.length);

  // Retrieve the name
  let name = niceList[randomIndex];

  // Should we introduce a typo ?
  const modifyTheName = Math.floor(Math.random() * 2);

  // Introducing a tyo if needed
  if (modifyTheName){
    let randomIndex = Math.floor(Math.random() * name.length);
    let randomLetterFromAscii = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    let nameArray = name.split('');
    nameArray[randomIndex] = randomLetterFromAscii;
    name = nameArray.join('');
  }

  console.log(name, ", index:", randomIndex, (modifyTheName) ? ('(typo in name)') : ('(original name)'));

  // Generating the proof to send to server
  const proof = merkleTree.getProof(randomIndex);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    clientProof: proof,
    nameTocheck: name,
  });

  console.log({ gift });

}

main();