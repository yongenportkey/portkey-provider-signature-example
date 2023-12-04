import { request, gql } from "graphql-request";

export const getManagerAddresses = async (caAddress?: string) => {
  if (!caAddress) return;

  const document = gql`
  {
    caHolderManagerInfo(dto:{caAddresses:["${caAddress}"],skipCount:0,maxResultCount:100}){
      chainId
      caAddress
      caHash
      originChainId
       managerInfos {
          address
          extraData
        }
    }
  }
`;
  const data = await request(
    "https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql", // testnet
    document
  );

  return data?.caHolderManagerInfo?.[0]?.managerInfos?.map(
    (i) => i.address
  ) as string[];
};
