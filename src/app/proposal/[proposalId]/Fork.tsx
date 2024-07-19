import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Fork = ({ proposalId }: { proposalId: string }) => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  const handleFork = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/simulate?id=${proposalId}&fork=true`);
      const data = await response.json();
      if (data.url) setUrl(data.url);
      else setError(data.message);
    } catch (error) {
      console.error("Error occurred during simulation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleFork} disabled={loading}>
        {loading ? "Loading..." : "Fork"}
      </button>
      {error && <p>{error}</p>}
      {url && (
        <ul>
          <li className="proposal-page-value call-data-link">
            <Link href={url} target="_blank" className="call-data-link">
              {url}
              <Image
                src={"/external-link.svg"}
                alt="link"
                width={20}
                height={20}
              ></Image>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Fork;
