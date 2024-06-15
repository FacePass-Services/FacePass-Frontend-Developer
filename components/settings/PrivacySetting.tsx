import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Privacy() {
  const router = useRouter();

  const navigateToCustomers = () => {
    router.push("/customers");
  };

  return (


<div>
<h1>Privacy & Security</h1>
</div>
  );
}
