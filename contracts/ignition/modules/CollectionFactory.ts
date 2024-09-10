import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CollectionFactoryModule = buildModule("CollectionFactoryModule", (m) => {
  const collectionFactory = m.contract("CollectionFactory");

  return { collectionFactory };
});

export default CollectionFactoryModule;