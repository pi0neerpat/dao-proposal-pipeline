import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Fork = ({ proposalId }: { proposalId: string }) => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string>();

  const handleFork = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/simulate?id=${proposalId}&fork=true`);
      const data = await response.json();
      setUrl(data.url);
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
