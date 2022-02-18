const assert = require('assert');
const { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const anchor = require('@project-serum/anchor');
const {SystemProgram} = anchor.web3;
const fs = require('fs')
const file = fs.readFileSync('target/idl/mymoneydapp.json', 'utf8');
const idl = JSON.parse(file);
const provider = anchor.Provider.local("https://ssc-dao.genesysgo.net");
//const provider = anchor.Provider.local();
const programId = new anchor.web3.PublicKey('97m9yX1LtHkBe5FVq6x8ZC7n6zVgNSq9dTdcALetuwNd');
const prog = new anchor.Program( idl, programId, provider);
let programSecret = [239,80,7,216,208,72,178,196,58,15,179,6,69,200,226,226,15,133,108,248,192,249,153,45,153,113,236,238,104,131,219,250,67,15,23,35,247,11,103,53,36,131,87,151,111,222,40,31,26,18,56,234,81,194,244,22,115,109,104,211,89,240,54,98]
let programSecret2 = [246,220,188,210,198,48,122,60,160,251,93,192,218,78,57,202,172,221,1,205,115,66,157,187,62,194,159,17,203,229,154,108,175,164,223,177,203,58,240,160,44,160,180,66,6,103,241,137,153,207,248,9,140,191,25,82,191,29,101,236,88,235,252,173]
let programSecret3 = [6,179,194,83,196,126,207,74,126,33,32,82,86,5,80,187,55,215,13,97,14,120,154,125,0,147,56,231,46,235,154,228,93,133,247,225,33,176,176,240,44,215,86,23,69,149,246,56,157,30,203,28,42,228,177,18,168,218,118,7,237,4,152,210]
let programSecret4 = [174,146,189,241,226,82,130,94,243,228,59,228,62,153,96,45,143,181,203,132,245,132,85,230,135,194,242,4,30,144,165,165,39,221,162,97,135,69,250,93,101,153,234,189,145,147,74,214,248,50,122,163,163,50,154,177,117,131,203,46,144,58,105,236];
let programSecret5 = [3,208,55,42,204,61,247,120,47,185,78,237,220,93,210,36,35,67,96,182,32,157,203,137,181,228,81,42,75,2,245,211,26,252,179,205,216,73,245,49,147,151,69,32,178,109,125,36,27,70,62,239,74,227,87,99,119,68,172,103,11,253,67,172];
let userAccount = [145,113,250,211,217,177,200,228,167,229,43,231,178,2,36,60,36,18,42,9,41,188,21,106,5,32,66,72,54,57,65,39,79,168,167,160,62,163,119,233,214,175,161,155,158,150,98,104,0,131,122,173,140,255,157,80,49,91,42,200,83,149,69,133]
let secretKeyServiceAccount = [179,211,222,34,38,216,149,109,10,161,202,137,0,160,110,199,71,18,136,239,103,240,59,244,140,104,105,77,238,233,37,231,180,227,173,218,254,114,253,82,115,97,77,106,67,159,90,255,120,11,237,120,0,60,8,64,225,34,169,129,214,209,17,87]
let commissionAccount = [113,218,106,125,26,163,205,15,153,106,119,169,3,55,235,36,141,6,41,255,37,233,40,30,52,3,157,108,180,20,136,159,251,162,229,40,89,15,166,210,173,140,75,39,84,94,197,220,158,168,143,236,50,227,46,196,229,67,24,220,39,121,66,97]
let resultAccount = [58,63,211,254,146,0,2,61,254,135,10,248,80,220,152,52,227,76,134,173,106,189,81,79,89,98,95,106,119,3,139,46,12,101,219,217,217,75,202,93,25,38,205,113,255,53,239,236,27,78,223,213,232,137,115,141,100,17,170,107,209,199,17,170]
const program_account = anchor.web3.Keypair.fromSecretKey(new Uint8Array(programSecret));
const program_account2 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(programSecret2));
const program_account3 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(programSecret3));
const program_account4 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(programSecret4));
const program_account5 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(programSecret5));
const user_account = anchor.web3.Keypair.fromSecretKey(new Uint8Array(userAccount));
const service_account = anchor.web3.Keypair.fromSecretKey(new Uint8Array(secretKeyServiceAccount));
const commission_account = anchor.web3.Keypair.fromSecretKey(new Uint8Array(commissionAccount));
const result_account = anchor.web3.Keypair.fromSecretKey(new Uint8Array(resultAccount));

function encodeSecret(uintArray) {
  return Buffer.from(uintArray).toString('base64');
}

function decodeSecret(base64String) {
  return new Uint8Array(Buffer.from(base64String, 'base64'));
}

describe('mycalculatordapp', () => {
  

  //const bet_account = test_account;
  //console.log("bet account is: " + bet_account.publicKey.toBase58());
  //console.log("service account is: " + service_account.publicKey.toBase58());

  //it('Creates a bet', async () => {
  //  await prog.rpc.create("123",{
  //    accounts: {
  //      bets: bet_account.publicKey,
  //      user: bet_account.publicKey,
  //      systemProgram: SystemProgram.programId
  //    },
  //    signers: [bet_account]
  //  });


  //  //const account = await prog.account.bets.fetch(bet_account.publicKey);
  //  //console.log(account);
  //  //console.log(account.id);
  //  assert.ok("12345" === "12345");
  //});

  //it('Creates a Result', async () => {
  //  await prog.rpc.createResult({
  //    accounts: {
  //      results: result_account.publicKey,
  //      user: result_account.publicKey,
  //      systemProgram: SystemProgram.programId
  //    },
  //    signers: [result_account]
  //  });

  //  const account = await prog.account.results.fetch(result_account.publicKey);
  //  console.log(account);
  //  console.log(account.id);
  //  assert.ok("12345" === "12345");
  //});

  //it('Place a bet', async () => {
  //  await prog.rpc.create("345", new anchor.BN(1250000000), "00001230", new anchor.BN(1), "1640000000", new anchor.BN(0), {
  //    accounts: {
  //      bets: bet_account.publicKey,
  //      user: bet_account.publicKey,
  //      programAccount: program_account.publicKey,
  //      serviceAccount: service_account.publicKey,
  //      commissionAccount: commission_account.publicKey,
  //      fromAccount: bet_account.publicKey,
  //      toAccount: service_account.publicKey,
  //      tokenProgram: TOKEN_PROGRAM_ID,
  //      fromAccountOwner: bet_account.publicKey,
  //      systemProgram: SystemProgram.programId
  //    },
  //    signers: [bet_account]
  //  });

  //  //const account = await prog.account.bets.fetch(bet_account.publicKey);
  //  //console.log(account.amount);
  //  //console.log(account.id[0]);
  //  //assert.ok(account.amount === account.amount);
  //});

//  it('Feed Result', async () => {
//    await prog.rpc.feedResult(new anchor.BN(1), "00001230", new anchor.BN(1), new anchor.BN(2.5), {
//      accounts: {
//        results: result_account.publicKey,
//        systemProgram: SystemProgram.programId
//      }
//    })
//  });


//    it('Settle a bet', async () => {
//    await prog.rpc.settleResult(new anchor.BN(1), "00001230", {
//      accounts: {
//        bets: bet_account.publicKey,
//        results: result_account.publicKey,
//        user: service_account.publicKey,
//        programAccount: program_account.publicKey,
//        serviceAccount: service_account.publicKey,
//        systemProgram: SystemProgram.programId,
//        toAccountOwner: pp
//      },
//      signers: [service_account]
//    });
//  });

  //  it('Safety Transfer', async () => {
  //    let pp = new anchor.web3.PublicKey('Gaw5HBXFe2W9uepHQ8ehGpHQ6eqEvAswdt9BHzPnet69');
  //  await prog.rpc.safetyResult(new anchor.BN(5000000000),{
  //    accounts: {
  //      user: service_account.publicKey,
  //      fromAccount: service_account.publicKey,
  //      systemProgram: SystemProgram.programId,
  //      toAccount: pp
  //    },
  //    signers: [service_account]
  //  });
  //});

  //  const account = await prog.account.bets.fetch(bet_account.publicKey);
  //  console.log(account.amount);
  //  console.log(account.id[0]);
  //  assert.ok(account.amount === account.amount);
  //});
});

describe ("v2 one contract", () => {
  let lclmacwallet =  anchor.web3.Keypair.fromSecretKey(new Uint8Array(
    [61,74,150,198,57,18,22,198,134,252,99,170,125,20,40,159,218,22,175,190,204,112,47,173,166,190,0,196,79,161,248,1,173,199,222,109,77,61,131,92,157,244,88,9,134,115,26,110,33,183,182,75,236,17,58,21,55,73,198,221,135,177,198,223]
  ));

  let betacc =  anchor.web3.Keypair.fromSecretKey(new Uint8Array(
    [176,6,1,18,22,79,234,184,97,203,253,225,28,142,113,114,139,205,19,26,26,212,238,102,105,97,215,255,154,236,231,156,46,138,208,118,125,204,104,196,98,2,154,95,138,173,203,15,226,69,29,15,131,230,95,124,58,153,115,70,5,160,146,92]
    )); //service acc
  
  
  console.log(lclmacwallet.publicKey.toBase58());
  it("Create a Result", async () => {
    let resacc =  anchor.web3.Keypair.fromSecretKey(new Uint8Array(
      [216,42,21,131,155,185,207,216,106,3,234,179,3,124,37,167,118,24,132,43,229,236,163,41,213,39,63,176,162,130,125,145,117,96,51,40,148,87,109,191,180,38,1,75,170,224,117,183,9,176,188,135,149,243,127,142,122,51,220,45,203,23,227,58]
    ));
    console.log(resacc.publicKey.toBase58());
    await prog.rpc.createResult(
      {
        accounts: {
          results: resacc.publicKey,
          user: lclmacwallet.publicKey,
          systemProgram: SystemProgram.programId
        },
        signers: [resacc, lclmacwallet]
      }
    )

  });

  it("Create a Service Account", async () => {
    
    console.log(betacc.publicKey.toBase58());
    await prog.rpc.create(betacc.publicKey.toBase58(),
      {
        accounts: {
          bets: betacc.publicKey,
          user: lclmacwallet.publicKey,
          systemProgram: SystemProgram.programId
        },
        signers: [betacc, lclmacwallet]
      }
    )

  });

  //it('Creates a bet', async () => {
  //  let testbettacc = anchor.web3.Keypair.generate();
  //    await prog.rpc.placeSingleBet(
  //      "abcd",
  //      new anchor.BN(1000000000),
  //      "00001230", 
  //      new anchor.BN(1), 
  //      "1640000000", 
  //      new anchor.BN(0),
  //      new anchor.BN(1250000000), 
  //      {
  //      accounts: {
  //        bets: testbettacc.publicKey,
  //        user: lclmacwallet.publicKey,
  //        systemProgram: SystemProgram.programId,
  //        tokenProgram: TOKEN_PROGRAM_ID,
  //        serviceAccount: betacc.publicKey,
  //        commissionAccount: lclmacwallet.publicKey,
  //        fromAccountCato: lclmacwallet.publicKey,
  //        toAccountCato: lclmacwallet.publicKey
  //      },
  //      signers: [testbettacc, lclmacwallet]
  //    });
  //  });

  //it("Feed Result", async () => {

  //  await prog.rpc.feedResult(new anchor.BN(1), "00001230", new anchor.BN(1), new anchor.BN(2.5),
  //    {
  //      accounts: {
  //        results: result_account.publicKey,
  //        systemProgram: SystemProgram.programId
  //      }
  //    }
  //  )

  //});

});