import { ec as EC } from "elliptic";
import { wallet } from "aelf-sdk";
const ec = new EC("secp256k1");
const { getAddressFromPubKey } = wallet;

type Signature = EC.Signature;
export function getManagerAddress(data: string, signature: Signature) {
  let publicKey = ec.recoverPubKey(
    Buffer.from(data, "hex"),
    signature,
    signature.recoveryParam!,
    "hex"
  );
  const managerAddress = getAddressFromPubKey(publicKey);
  return managerAddress;
}
