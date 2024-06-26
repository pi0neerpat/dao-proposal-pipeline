import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Simulation = ({ proposalId }: { proposalId: string }) => {
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  const handleSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/simulate?id=${proposalId}`);
      const data = await response.json();
      setUrls(data.simulations);
    } catch (error) {
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
