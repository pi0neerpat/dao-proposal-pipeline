import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Simulation = ({ proposalId }: { proposalId: string }) => {
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSimulation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/simulate?id=${proposalId}`);
      const data = await response.json();
      if (data.simulation) setUrls(data.simulations);
      else setError(data.message);
    } catch (error) {
      setError(`${error}`);
      console.error("Error occurred during simulation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSimulation} disabled={loading}>
        {loading ? "Loading..." : "Simulate"}
      </button>
      {error && <p>{error}</p>}
      {urls?.length > 0 && (
        <ul>
          {urls.map((url, index) => (
            <li key={index} className="proposal-page-value call-data-link">
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
          ))}
        </ul>
      )}
    </div>
  );
};

export default Simulation;
