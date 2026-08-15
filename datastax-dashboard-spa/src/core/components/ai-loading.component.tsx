import { AISkeletonIcon } from "@carbon/react";

const AILoadingComponent: React.FC = () => {
  const propsSkeleton = {
    style: {
      margin: "100px",
    },
  };
  const propsSkeleton2 = {
    style: {
      margin: "100px",
      width: "50px",
      height: "50px",
    },
  };
  const propsSkeleton3 = {
    style: {
      margin: "100px",
      width: "100px",
      height: "100px",
    },
  };
  return (
    <>
      <AISkeletonIcon {...propsSkeleton} />
      <AISkeletonIcon {...propsSkeleton2} />
      <AISkeletonIcon {...propsSkeleton3} />
    </>
  );
};

export default AILoadingComponent;
