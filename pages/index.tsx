import Logo from "@/bases/logo";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/sign-in");
  }, []);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#FFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Logo size="M" />
    </div>
  );
}
