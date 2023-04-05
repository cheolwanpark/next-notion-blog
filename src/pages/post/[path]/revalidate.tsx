import { Spinner } from "@/components/spinner";
import { useRouter } from "next/router";
import { useState } from "react";

export default function RevalidatePost() {
  const router = useRouter();
  const { path } = router.query;
  const targetPath = `/post/${path}`;
  const [pending, setPending] = useState(false);

  const revalidateCurrentPage = async () => {
    const secret = prompt("Enter the secret");
    if (!secret) {
      router.replace(targetPath);
    }

    setPending(true);
    const res = await fetch("/api/revalidate", {
      method: "POST",
      body: JSON.stringify({ secret, path: targetPath }),
    });
    setPending(false);

    if (res.ok) {
      alert(`Revalidated ${targetPath}`);
    } else {
      const json = await res.json();
      alert(`Revalidation failed, ${json.message}`);
    }
    router.replace(targetPath);
  };
  return (
    <>
      <div className="box">
        {pending ? (
          <Spinner />
        ) : (
          <button onClick={revalidateCurrentPage} style={{ margin: "auto" }}>
            Revalidate
          </button>
        )}
      </div>
      <style jsx>{`
        .box {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 65vh;
          width: 100%;
          --spinner-color: var(--color);
        }
      `}</style>
    </>
  );
}
