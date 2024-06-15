import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Sound() {
  const router = useRouter();

  const navigateToCustomers = () => {
    router.push("/customers");
  };

  return (
 
<div>
<h1>Sound</h1>
</div>
  );
}
