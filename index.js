const solanaWeb3 = require('@solana/web3.js');
const { Connection, PublicKey, Keypair,SystemProgram } = solanaWeb3;


const connectionToSolana = async () => {
  try {
    // Create a connection to the Solana devnet
    const connection = new Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
    console.log('Connected to Solana devnet');
    return connection;
  } catch (error) {
    console.error('Error connecting to Solana:', error);
  }
};

// Airdrop of 1 SOL to a specific public key
const airdropSol = async (publicKey) => {
  try {
    const connection = await connectionToSolana();
    const publicKeyObj = new PublicKey(publicKey);
    const airdropSignature = await connection.requestAirdrop(publicKeyObj, solanaWeb3.LAMPORTS_PER_SOL);
    // Confirm the airdrop transaction


    await connection.confirmTransaction(airdropSignature);
    console.log(`Airdropped 1 SOL to ${publicKey}`);
    } catch (error) {
    console.error('Error during airdrop:', error);
  }
};

const getBalance = async (publicKey) => {
  try {
    const connection = await connectionToSolana();
    const balance = await connection.getBalance(new PublicKey(publicKey));
    console.log(`Balance for ${publicKey}:`, balance / solanaWeb3.LAMPORTS_PER_SOL, 'SOL');
  } catch (error) {
    console.error('Error getting balance:', error);
  }
};

// Create account with data
const createAccountWithData = async (data) => {
  try {
     const connection = await connectionToSolana();
    // const keypair = Keypair.generate();
    // const publicKey = keypair.publicKey.toBase58();
    // use a specific keypair for account creation
    const secretKey = Uint8Array.from(
        [
                 184, 186,  86, 104, 160, 208, 133,  12, 122,  82,  52,
                 169,   3, 155, 212,  40, 177, 124, 151, 104,   6, 160,
                 122,  80, 248,  57, 108, 201, 139,  67, 153, 212,  96,
                 225,  75, 177,  77, 153, 109,  40,  43, 114,  12, 227,
                 192, 143,  77, 203,  67,  25, 142,  15, 179,  39,  92,
                 219, 121, 218, 167,  55,  62,  67, 176,  88
               ]);
    let keypairOwn = Keypair.fromSecretKey(secretKey);

    const secretKeyOther = Uint8Array.from(
        [
            114,  92,  14,   1,  27,  42, 243, 121, 168,  86,  96,
                  64, 159, 100, 169, 246, 112,  92, 154,  87,  71, 214,
                  39, 198,  90, 101,   0, 164,  75,  94,   9, 253,  60,
                 171, 217, 152, 252, 191, 246, 184,  65,  79, 246,  38,
                  50, 114, 215, 124,   4,  35, 223,  31, 138, 149,  89,
                 245,  95,  78, 152,  74, 184,  87, 193,   1
               ]);

      let keypairOther = Keypair.fromSecretKey(secretKeyOther);

   // const keypairOther = new PublicKey('7jE9vJYxjkHpVZR11NfG3E3ox4gY5eT71JfcqNW1F9Lg'); // Replace with your actual public key
 console.log('Keypair Own:', keypairOwn.publicKey);
    console.log('Keypair Other:', keypairOther.publicKey);

    // Get keypair frompublic key

    // const keypair = Keypair.fromPublicKey(new PublicKey(publicKey));

    // Create a new account with the provided data
    console.log({
        fromPubkey: keypairOwn?.publicKey,
        newAccountPubkey: keypairOther.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(data.length),
        space: data?.length,
        //programId: programId?.toBase58(),
      });


    const transaction = new solanaWeb3.Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: keypairOwn?.publicKey,
        newAccountPubkey: keypairOther?.publicKey,
        lamports: await connection?.getMinimumBalanceForRentExemption(data?.length),
        space: data?.length,
        // add the programId
        programId: new PublicKey('7jE9vJYxjkHpVZR11NfG3E3ox4gY5eT71JfcqNW1F9Lf'),
        //data: Buffer.from(data, 'utf8'), // Convert data to a Buffer
      })
    );

    // Sign and send the transaction
    const signature = await solanaWeb3.sendAndConfirmTransaction(connection,
        transaction, [keypairOwn, keypairOther]);
    console.log('Account created with signature:', signature);
  } catch (error) {
    console.error('Error creating account with data:', error);
  }
};


connectionToSolana()
  .then(async (connection) => {

    // 7XBPiR3QEaj24rnG6dWDgsjQcjx3DKrhV38FB3j9PsjV
    // [
    //     184, 186,  86, 104, 160, 208, 133,  12, 122,  82,  52,
    //     169,   3, 155, 212,  40, 177, 124, 151, 104,   6, 160,
    //     122,  80, 248,  57, 108, 201, 139,  67, 153, 212,  96,
    //     225,  75, 177,  77, 153, 109,  40,  43, 114,  12, 227,
    //     192, 143,  77, 203,  67,  25, 142,  15, 179,  39,  92,
    //     219, 121, 218, 167,  55,  62,  67, 176,  88
    //   ]
    // Secret Key: [
    //     114,  92,  14,   1,  27,  42, 243, 121, 168,  86,  96,
    //      64, 159, 100, 169, 246, 112,  92, 154,  87,  71, 214,
    //      39, 198,  90, 101,   0, 164,  75,  94,   9, 253,  60,
    //     171, 217, 152, 252, 191, 246, 184,  65,  79, 246,  38,
    //      50, 114, 215, 124,   4,  35, 223,  31, 138, 149,  89,
    //     245,  95,  78, 152,  74, 184,  87, 193,   1
    //   ]

    //  55qSvGRVaXUeRpueFnTqdJH8BxNyUt5n6TvyCm8VWtWU

   // getBalance('7XBPiR3QEaj24rnG6dWDgsjQcjx3DKrhV38FB3j9PsjV'); // Replace with your actual public key
    await createAccountWithData('{long:35, lat: 87, name: michael}'); // Replace with your actual data
    // Uncomment the following lines to generate a new keypair
    // Generate a new keypair
    // const keypair = Keypair.generate();
    // console.log('Generated Keypair:', keypair.publicKey.toBase58());
    // // get secret key
    // console.log('Secret Key:', Array.from(keypair.secretKey));
    //airdropSol('7XBPiR3QEaj24rnG6dWDgsjQcjx3DKrhV38FB3j9PsjV');
  })
  .catch((error) => {
    console.error('Error in connectionToSolana:', error);
  });
